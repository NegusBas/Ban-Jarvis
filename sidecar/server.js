const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

console.log("💪 Jarvis Sidecar (MK. V) Initializing...");

// 1. SYSTEM SEARCH (Spotlight)
app.post('/system/find', (req, res) => {
    const { query } = req.body;
    console.log(`[SEARCH] ${query}`);
    exec(`mdfind -name "${query}" | head -n 5`, (error, stdout) => {
        if (error) return res.status(500).json({ error: error.message });
        res.json({ files: stdout.split('\n').filter(Boolean) });
    });
});

// 2. GIT OPERATIONS
app.post('/git/ops', (req, res) => {
    const { command, projectPath, message } = req.body;
    let cmd = '';
    if (command === 'push') cmd = `cd "${projectPath}" && git add . && git commit -m "${message}" && git push`;
    
    console.log(`[GIT] ${command}`);
    exec(cmd, (error, stdout) => {
        if (error) return res.status(500).json({ error: error.message });
        res.json({ output: stdout });
    });
});

// 3. BROWSER AUTOMATION (Job Apps)
app.post('/browser/act', async (req, res) => {
    const { url, action, inputs } = req.body;
    console.log(`[BROWSER] ${action} on ${url}`);
    try {
        const browser = await puppeteer.launch({ headless: false }); 
        const page = await browser.newPage();
        await page.goto(url);
        // Heuristic Form Filling
        if (action === 'fill_form' && inputs) {
             for (const [key, value] of Object.entries(inputs)) {
                try {
                    await page.type(`input[name*="${key}"]`, value);
                } catch(e) {}
             }
        }
        res.json({ status: 'Browser Active', url: page.url() });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.listen(PORT, () => console.log(`🚀 Sidecar ready on http://localhost:${PORT}`));
