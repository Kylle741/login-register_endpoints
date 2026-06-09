const verifyEmailPage = (status, message) => {
    const isSuccess = status === 'success';
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title>${isSuccess ? 'Email Verified' : 'Verification Failed'}</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f7;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                }
                .card {
                    background: #ffffff;
                    border-radius: 8px;
                    padding: 48px 40px;
                    text-align: center;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    max-width: 480px;
                    width: 100%;
                }
                .icon { font-size: 64px; margin-bottom: 24px; }
                h1 {
                    font-size: 24px;
                    color: ${isSuccess ? '#4F46E5' : '#E53E3E'};
                    margin-bottom: 16px;
                }
                p { font-size: 15px; color: #666666; line-height: 1.6; }
            </style>
        </head>
        <body>
            <div class="card">
                <div class="icon">${isSuccess ? '✅' : '❌'}</div>
                <h1>${isSuccess ? 'Email Verified!' : 'Verification Failed'}</h1>
                <p>${message}</p>
            </div>
        </body>
        </html>
    `;
};

module.exports = verifyEmailPage;