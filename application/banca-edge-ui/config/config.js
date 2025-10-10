module.exports = {
  development: {
    app: {
      name: 'Passport SAML strategy example',
      port: process.env.PORT || 3000,
    },
    passport: {
      strategy: 'saml',
      saml: {
        path: '/consume',
        host: 'uat.bancaedge.com',
        protocol: 'https://',
        //  callbackUrl: 'https://mywebserver.mybluemix.net/login/callback'
        entryPoint:
          'https://adfs2.dcbbank.com/adfs/ls/IdpInitiatedSignon.aspx?loginToRp=uat.bancaedge.com',
        issuer: 'uat.bancaedge.com',
        logoutUrl: '/dcbLogout',
        logoutCallback: '/dcb',
        cert: 'MIIC3jCCAcagAwIBAgIQfnJ0TLYosLRDLVPbyYmVQzANBgkqhkiG9w0BAQsFADArMSkwJwYDVQQDEyBBREZTIFNpZ25pbmcgLSBhZGZzMi5kY2JiYW5rLmNvbTAeFw0yMjA4MTUxNTQ3MjVaFw0yMzA4MTUxNTQ3MjVaMCsxKTAnBgNVBAMTIEFERlMgU2lnbmluZyAtIGFkZnMyLmRjYmJhbmsuY29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqWi/QiIgeTsVvpZdH/tOprbP6I1iqFye1wARxnd7rttkm1bFUsYcVc3jPN4TKLzuiWnbLGqC6aL0wiN75MERo5QJNLt13cOc3Vrb+vkp0fXWQkOqN59r3GLhXCCs/p686LZw8mZDd1f7uY5R4Eo+UIN5FLtqMiL461YkVMBQPYa9gVoHjFnd3bupsZjcYr6MLhSvOYAcbpOX0PcapdfKCzigENh6PDX+fOT8OhPDHTJRMhcjdfWAu/RiXtcpDbc9ZVgOYe4BaTjEQ0DFnLKclyebcrht1A200YnF7jRwx/9ip514+2CtVX10hQ9gSsUKDxfmu2okOlFinje0Tk6zgQIDAQABMA0GCSqGSIb3DQEBCwUAA4IBAQBaZAHf4UYSCGsuVfWbACUe4IDi6oOeFTrlEIalfdCgS463QGE6YubgrPXAX/TBGqKLqJvLrMZvA1/ryfpMCvDfdV4CFOhNNniMGAnuQKzFcFq4zfeBC2qFe/Bxv+Qyxw3Z3jilRQsljltQ1+It1Nd0+cACwqWLH3y77zsthKy+Wh005rHIuIFY4iMG7GmTBazjnJQe9aOS0GJo9+WzjFpCSKV1aVIk0BQBHXjKwaOEGtNdCnHML56psdXcMritvDyQrr6warayo3VrhpLcPt2qBkyohJS92/qkPfyOv7ndNZ0+QQ1vn5EgEGPJXq2/3QFaKaHEr3vHnvKcWyPZ9M/V',
      },
    },
  },
};

// https://adfs2.dcbbank.com/adfs/services/trust
