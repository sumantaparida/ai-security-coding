#!/usr/bin/env node

const http = require('http');

// Test data for different vulnerability types
const testCases = [
  {
    name: "SQL Injection Test",
    data: {
      vuln_type: "SQL Injection",
      file_path: "user-service.js",
      before_snippet: 'const query = "SELECT * FROM users WHERE id = " + userId;',
      context: "User input validation missing in database query"
    }
  },
  {
    name: "XSS Test",
    data: {
      vuln_type: "Cross-Site Scripting",
      file_path: "template.html",
      before_snippet: '<div innerHTML={userInput}></div>',
      context: "User input directly rendered in HTML without sanitization"
    }
  },
  {
    name: "Path Traversal Test",
    data: {
      vuln_type: "Path Traversal",
      file_path: "file-handler.js",
      before_snippet: 'const filePath = "./uploads/" + req.params.filename;',
      context: "File path constructed from user input without validation"
    }
  }
];

function makeRequest(testCase) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(testCase.data);
    
    const options = {
      hostname: 'localhost',
      port: 4000,
      path: '/suggest-patch',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve({ testCase: testCase.name, response, status: res.statusCode });
        } catch (error) {
          resolve({ testCase: testCase.name, error: 'Invalid JSON response', rawData: data, status: res.statusCode });
        }
      });
    });

    req.on('error', (error) => {
      reject({ testCase: testCase.name, error: error.message });
    });

    req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Testing AI Security Patch Server');
  console.log('=====================================\n');

  // Test server connectivity first
  console.log('🔍 Checking server connectivity...');
  try {
    const healthCheck = await new Promise((resolve, reject) => {
      const req = http.request({
        hostname: 'localhost',
        port: 4000,
        path: '/',
        method: 'GET'
      }, (res) => {
        resolve(res.statusCode);
      });
      
      req.on('error', (error) => {
        reject(error);
      });
      
      req.setTimeout(5000, () => {
        req.destroy();
        reject(new Error('Connection timeout'));
      });
      
      req.end();
    });
    
    console.log('✅ Server is responding\n');
  } catch (error) {
    console.log('❌ Server is not responding. Please start the server with: pnpm dev');
    console.log(`Error: ${error.message}\n`);
    process.exit(1);
  }

  // Run test cases
  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`🧪 Running Test ${i + 1}: ${testCase.name}`);
    console.log('-'.repeat(50));
    
    try {
      const result = await makeRequest(testCase);
      
      console.log(`Status Code: ${result.status}`);
      
      if (result.error) {
        console.log('❌ Test Failed');
        console.log(`Error: ${result.error}`);
        if (result.rawData) {
          console.log(`Raw Response: ${result.rawData.substring(0, 200)}...`);
        }
      } else {
        console.log('✅ Test Passed');
        
        // Check if response has expected fields
        const response = result.response;
        if (response.explanation && response.diff && response.test_plan) {
          console.log('✅ Response contains all required fields');
          console.log(`📝 Explanation: ${response.explanation.substring(0, 100)}...`);
          console.log(`🔧 Diff Preview:\n${response.diff}`);
          console.log(`🧪 Test Plan: ${response.test_plan.substring(0, 100)}...`);
        } else if (response.error) {
          console.log('⚠️  AI Service returned an error:');
          console.log(`Error: ${response.error}`);
          if (response.raw_response) {
            console.log(`Raw AI Response: ${response.raw_response.substring(0, 200)}...`);
          }
        } else {
          console.log('⚠️  Response missing some expected fields');
          console.log('Fields received:', Object.keys(response));
        }
      }
      
    } catch (error) {
      console.log('❌ Test Failed');
      console.log(`Error: ${error.error || error.message}`);
    }
    
    console.log('\n');
  }

  console.log('🎉 Test Suite Complete!');
  console.log('=====================================');
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n👋 Test interrupted by user');
  process.exit(0);
});

// Run the tests
runTests().catch(console.error);