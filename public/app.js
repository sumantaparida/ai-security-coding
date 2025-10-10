// DOM elements
const vulnerabilityForm = document.getElementById('vulnerabilityForm');
const submitBtn = document.getElementById('submitBtn');
const resultsContainer = document.getElementById('resultsContainer');
const statusElement = document.getElementById('status');
const statusText = statusElement.querySelector('.status-text');
const statusDot = statusElement.querySelector('.status-dot');

// Mode toggle elements
const snippetModeBtn = document.getElementById('snippetModeBtn');
const directoryModeBtn = document.getElementById('directoryModeBtn');
const snippetForm = document.getElementById('snippet-form');
const directoryForm = document.getElementById('directory-form');
const dependencyModeBtn = document.getElementById('dependencyModeBtn');

// Example data for quick testing
const examples = {
    sql: {
        vuln_type: 'SQL Injection',
        file_path: '/src/controllers/user.js',
        before_snippet: 'const query = "SELECT * FROM users WHERE id = " + userId;\ndb.query(query, callback);',
        context: 'User input directly concatenated into SQL query without parameterization'
    },
    xss: {
        vuln_type: 'Cross-Site Scripting',
        file_path: '/src/templates/profile.html',
        before_snippet: '<div class="user-bio">\n  ${userBio}\n</div>',
        context: 'User-generated content rendered without HTML encoding or sanitization'
    },
    path: {
        vuln_type: 'Path Traversal',
        file_path: '/src/controllers/file.js',
        before_snippet: 'const filePath = "./uploads/" + req.params.filename;\nfs.readFile(filePath, callback);',
        context: 'File path constructed from user input without validation or sanitization'
    }
};

// Update status indicator
function updateStatus(text, type = 'ready') {
    statusText.textContent = text;
    statusDot.className = 'status-dot';
    
    switch(type) {
        case 'loading':
            statusDot.style.background = 'var(--warning-color)';
            break;
        case 'success':
            statusDot.style.background = 'var(--success-color)';
            break;
        case 'error':
            statusDot.style.background = 'var(--danger-color)';
            break;
        default:
            statusDot.style.background = 'var(--success-color)';
    }
}

// Show loading state
function setLoadingState(loading) {
    if (loading) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        updateStatus('Analyzing vulnerability...', 'loading');
    } else {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        updateStatus('Ready', 'ready');
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Display results in the results section
function displayResults(data) {
    const { explanation, diff, test_plan } = data;

    const resultsHtml = `
        <div class="results-content fade-in">
            <div class="result-section">
                <h4><i class="fas fa-lightbulb"></i> Vulnerability Explanation</h4>
                <div class="explanation">${escapeHtml(explanation || 'No explanation provided.')}</div>
            </div>

            <div class="result-section">
                <h4><i class="fas fa-code"></i> Suggested Fix (Diff)</h4>
                <div id="diff-container"></div>
            </div>

            <div class="result-section">
                <h4><i class="fas fa-vial"></i> Test Plan</h4>
                <div class="test-plan">${escapeHtml(test_plan || 'No test plan provided.')}</div>
            </div>
        </div>
    `;

    resultsContainer.innerHTML = resultsHtml;

    if (diff) {
        const diff2htmlUi = new Diff2HtmlUI(document.getElementById('diff-container'), diff, {
            drawFileList: false,
            fileContentToggle: false,
            outputFormat: 'side-by-side',
            matching: 'lines'
        });
        diff2htmlUi.draw();
    }


    // Scroll to results
    document.querySelector('.results-section').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Display error message
function displayError(error) {
    const errorHtml = `
        <div class="results-content fade-in">
            <div class="result-section bg-danger">
                <h4><i class="fas fa-exclamation-triangle text-danger"></i> Error</h4>
                <div class="explanation">
                    ${escapeHtml(error.message || 'An unexpected error occurred.')}
                </div>
                ${error.raw_response ? `
                    <details style="margin-top: 15px;">
                        <summary style="cursor: pointer; color: var(--secondary-text);">Raw AI Response</summary>
                        <pre style="margin-top: 10px; padding: 10px; background: var(--primary-bg); border-radius: 4px; font-size: 0.8rem;">${escapeHtml(error.raw_response)}</pre>
                    </details>
                ` : ''}
            </div>
        </div>
    `;
    
    resultsContainer.innerHTML = errorHtml;
    updateStatus('Error occurred', 'error');
}

// Handle form submission
async function handleFormSubmission(event) {
    event.preventDefault();
    console.log('Form submitted');

    if (snippetModeBtn.classList.contains('active')) {
        console.log('Snippet mode is active');
        await handleSnippetScan();
    } else if (directoryModeBtn.classList.contains('active')) {
        console.log('Directory mode is active');
        await handleDirectoryScan();
    } else {
        console.log('Dependency mode is active');
        await handleDependencyScan();
    }
}

async function handleDependencyScan() {
    console.log('handleDependencyScan called');
    setLoadingState(true);

    try {
        const response = await fetch('/scan-dependencies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }

        console.log(data);
        updateStatus('Dependency scan complete', 'success');

    } catch (error) {
        console.error('API Error:', error);
        displayError({
            message: `Failed to scan dependencies: ${error.message}`,
            details: 'Please ensure the server is running.'
        });
    } finally {
        setLoadingState(false);
    }
}

async function handleSnippetScan() {
    // Get form data
    const formData = new FormData(vulnerabilityForm);
    const payload = {
        vuln_type: formData.get('vuln_type'),
        file_path: formData.get('file_path'),
        before_snippet: formData.get('before_snippet'),
        context: formData.get('context') || 'No additional context provided.'
    };

    // Validate required fields
    if (!payload.vuln_type || !payload.file_path || !payload.before_snippet) {
        displayError({ message: 'Please fill in all required fields for snippet analysis.' });
        return;
    }

    setLoadingState(true);

    try {
        // Make API call to the patch suggestion endpoint
        const response = await fetch('/suggest-patch', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }

        // Check if the response contains an error
        if (data.error) {
            displayError(data);
        } else {
            displayResults(data);
            updateStatus('Analysis complete', 'success');
        }

    } catch (error) {
        console.error('API Error:', error);
        displayError({
            message: `Failed to connect to AI service: ${error.message}`,
            details: 'Please check if the server is running and the API endpoint is accessible.'
        });
    } finally {
        setLoadingState(false);
    }
}

async function handleDirectoryScan() {
    console.log('handleDirectoryScan called');
    const directoryPath = document.getElementById('directoryPath').value;
    console.log('Directory path:', directoryPath);

    if (!directoryPath) {
        displayError({ message: 'Please provide a directory path to scan.' });
        return;
    }

    setLoadingState(true);

    try {
        const response = await fetch('/scan-directory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ directory_path: directoryPath })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }

        displayDirectoryScanResults(data);
        updateStatus('Directory scan complete', 'success');

    } catch (error) {
        console.error('API Error:', error);
        displayError({
            message: `Failed to scan directory: ${error.message}`,
            details: 'Please ensure the server is running and the directory path is correct.'
        });
    } finally {
        setLoadingState(false);
    }
}

function displayDirectoryScanResults(data) {
    const { suggestions } = data;

    if (!suggestions || suggestions.length === 0) {
        resultsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-check-circle"></i>
                <h3>No vulnerabilities found</h3>
                <p>The directory was scanned and no vulnerabilities were found.</p>
            </div>
        `;
        return;
    }

    let resultsHtml = '';
    suggestions.forEach((item, index) => {
        const { finding, suggestion } = item;
        const diffContainerId = `diff-container-${index}`;

        resultsHtml += `
            <div class="result-section">
                <h4><i class="fas fa-file-code"></i> ${escapeHtml(finding.path)}</h4>
                <div class="finding-details">
                    <strong>Vulnerability:</strong> ${escapeHtml(finding.check_id)}<br>
                    <strong>Message:</strong> ${escapeHtml(finding.extra.message)}
                </div>

                <h5><i class="fas fa-lightbulb"></i> Vulnerability Explanation</h5>
                <div class="explanation">${escapeHtml(suggestion.explanation || 'No explanation provided.')}</div>

                <h5><i class="fas fa-code"></i> Suggested Fix (Diff)</h5>
                <div id="${diffContainerId}" class="diff-container"></div>

                <h5><i class="fas fa-vial"></i> Test Plan</h5>
                <div class="test-plan">${escapeHtml(suggestion.test_plan || 'No test plan provided.')}</div>
            </div>
        `;
    });

    resultsContainer.innerHTML = resultsHtml;

    suggestions.forEach((item, index) => {
        const { suggestion } = item;
        const diffContainerId = `diff-container-${index}`;
        if (suggestion.diff) {
            const diff2htmlUi = new Diff2HtmlUI(document.getElementById(diffContainerId), suggestion.diff, {
                drawFileList: false,
                fileContentToggle: false,
                outputFormat: 'side-by-side',
                matching: 'lines'
            });
            diff2htmlUi.draw();
        }
    });

    // Scroll to results
    document.querySelector('.results-section').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Handle example button clicks
function handleExampleClick(exampleType) {
    const example = examples[exampleType];
    if (!example) return;
    
    // Populate form with example data
    document.getElementById('vulnType').value = example.vuln_type;
    document.getElementById('filePath').value = example.file_path;
    document.getElementById('codeSnippet').value = example.before_snippet;
    document.getElementById('context').value = example.context;
    
    // Add visual feedback
    const exampleBtns = document.querySelectorAll('.example-btn');
    exampleBtns.forEach(btn => btn.classList.remove('active'));
    event.target.closest('.example-btn').classList.add('active');
    
    // Scroll to form
    document.querySelector('.input-section').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

// Initialize event listeners
function initializeEventListeners() {
    // Form submission
    vulnerabilityForm.addEventListener('submit', handleFormSubmission);

    // Mode toggle buttons
    snippetModeBtn.addEventListener('click', () => {
        snippetModeBtn.classList.add('active');
        directoryModeBtn.classList.remove('active');
        dependencyModeBtn.classList.remove('active');
        snippetForm.style.display = 'block';
        directoryForm.style.display = 'none';
        vulnerabilityForm.style.display = 'block';
        submitBtn.querySelector('span').textContent = 'Generate Security Patch';
    });

    directoryModeBtn.addEventListener('click', () => {
        directoryModeBtn.classList.add('active');
        snippetModeBtn.classList.remove('active');
        dependencyModeBtn.classList.remove('active');
        directoryForm.style.display = 'block';
        snippetForm.style.display = 'none';
        vulnerabilityForm.style.display = 'block';
        submitBtn.querySelector('span').textContent = 'Scan Directory';
    });

    dependencyModeBtn.addEventListener('click', () => {
        dependencyModeBtn.classList.add('active');
        snippetModeBtn.classList.remove('active');
        directoryModeBtn.classList.remove('active');
        vulnerabilityForm.style.display = 'none';
        submitBtn.querySelector('span').textContent = 'Scan Dependencies';
    });
    
    // Example buttons
    document.querySelectorAll('.example-btn').forEach(btn => {
        btn.addEventListener('click', (event) => {
            const exampleType = btn.getAttribute('data-example');
            handleExampleClick(exampleType);
        });
    });
    
    // Auto-resize textareas
    document.querySelectorAll('textarea').forEach(textarea => {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    });
}

// Check server health on load
async function checkServerHealth() {
    try {
        updateStatus('Checking server...', 'loading');
        
        const response = await fetch('/suggest-patch', {
            method: 'OPTIONS'
        });
        
        updateStatus('Server connected', 'success');
    } catch (error) {
        updateStatus('Server offline', 'error');
        console.warn('Server health check failed:', error);
        
        // Show connection error in results
        displayError({
            message: 'Unable to connect to the AI service.',
            details: 'Please ensure the server is running on port 4000. Run `pnpm dev` to start the server.'
        });
    }
}

// Add some utility functions for better UX
function addTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('data-tooltip');
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + rect.width / 2 + 'px';
            tooltip.style.top = rect.top - 40 + 'px';
        });
        
        element.addEventListener('mouseleave', function() {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
}

// Handle keyboard shortcuts
function handleKeyboardShortcuts() {
    document.addEventListener('keydown', function(event) {
        // Ctrl/Cmd + Enter to submit form
        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
            event.preventDefault();
            if (!submitBtn.disabled) {
                vulnerabilityForm.dispatchEvent(new Event('submit'));
            }
        }
        
        // Escape to clear results
        if (event.key === 'Escape') {
            const emptyState = `
                <div class="empty-state">
                    <i class="fas fa-robot"></i>
                    <h3>Ready to analyze vulnerabilities</h3>
                    <p>Submit a vulnerability above to get AI-powered security recommendations</p>
                </div>
            `;
            resultsContainer.innerHTML = emptyState;
        }
    });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔒 AI Security Assistant initialized');
    
    initializeEventListeners();
    addTooltips();
    handleKeyboardShortcuts();
    
    // Small delay to ensure server is ready
    setTimeout(checkServerHealth, 1000);
    
    // Add welcome message to console
    console.log(`
    🚀 AI Security Coding Assistant
    ================================
    
    Keyboard shortcuts:
    - Ctrl/Cmd + Enter: Submit form
    - Escape: Clear results
    
    Example vulnerabilities loaded and ready to test!
    `);
});