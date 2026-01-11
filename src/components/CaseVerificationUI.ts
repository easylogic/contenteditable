import { AutomatedCaseVerifier, runAutomatedVerification } from '../utils/automated-case-verifier';

/**
 * Case Verification Web Component
 * 
 * This component provides an interface for running automated case verification
 * and viewing the results in a user-friendly format.
 */

class CaseVerificationUI extends HTMLElement {
  private verifier: AutomatedCaseVerifier;
  private isRunning = false;
  private currentResults: any[] = [];
  private filterSettings = {
    browser: 'all',
    os: 'all',
    status: 'all'
  };
  
  constructor() {
    super();
    this.verifier = new AutomatedCaseVerifier();
    this.setupUI();
  }
  
  connectedCallback() {
    this.render();
  }
  
  private setupUI(): void {
    this.innerHTML = `
      <div class="verification-container">
        <header class="verification-header">
          <h2>Case Verification System</h2>
          <div class="controls">
            <button id="run-tests" class="run-btn">
              <span class="icon">▶</span> Run All Tests
            </button>
            <div class="filters">
              <select id="browser-filter" class="filter-select">
                <option value="all">All Browsers</option>
                <option value="chrome">Chrome</option>
                <option value="firefox">Firefox</option>
                <option value="safari">Safari</option>
                <option value="edge">Edge</option>
              </select>
              <select id="os-filter" class="filter-select">
                <option value="all">All OS</option>
                <option value="windows">Windows</option>
                <option value="macos">macOS</option>
                <option value="linux">Linux</option>
                <option value="android">Android</option>
                <option value="ios">iOS</option>
              </select>
              <select id="status-filter" class="filter-select">
                <option value="all">All Status</option>
                <option value="passed">Passed Only</option>
                <option value="failed">Failed Only</option>
                <option value="low-confidence">Low Confidence</option>
              </select>
            </div>
            <button id="export-results" class="export-btn">
              <span class="icon">📊</span> Export
            </button>
          </div>
        </header>
        
        <main class="verification-content">
          <div class="progress-section" id="progress-section" style="display: none;">
            <div class="progress-bar">
              <div class="progress-fill" id="progress-fill"></div>
            </div>
            <div class="progress-text" id="progress-text">Running tests...</div>
          </div>
          
          <div class="results-section" id="results-section">
            <div class="results-header">
              <h3>Verification Results</h3>
              <div class="stats" id="stats-display">
                <span class="stat-item">Total: <span class="stat-value" id="total-tests">0</span></span>
                <span class="stat-item">Passed: <span class="stat-value passed" id="passed-tests">0</span></span>
                <span class="stat-item">Failed: <span class="stat-value failed" id="failed-tests">0</span></span>
              </div>
            </div>
            
            <div class="results-grid" id="results-grid">
              <div class="no-results">
                <p>Click "Run All Tests" to start verification</p>
              </div>
            </div>
          </div>
        </main>
        
        <footer class="verification-footer">
          <div class="help-text">
            <strong>What this does:</strong> Automatically tests contenteditable cases across different environments to verify behavior and identify platform-specific issues.
          </div>
        </footer>
      </div>
      
      <style>
        .verification-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .verification-header {
          border-bottom: 2px solid #e0e0e0;
          padding-bottom: 20px;
          margin-bottom: 20px;
        }
        
        .verification-header h2 {
          margin: 0 0 15px 0;
          color: #333;
          font-size: 24px;
        }
        
        .controls {
          display: flex;
          align-items: center;
          gap: 15px;
          flex-wrap: wrap;
        }
        
        .run-btn, .export-btn {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s ease;
        }
        
        .run-btn {
          background: #007acc;
          color: white;
        }
        
        .run-btn:hover {
          background: #005a9e;
        }
        
        .run-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        
        .export-btn {
          background: #28a745;
          color: white;
        }
        
        .export-btn:hover {
          background: #1e7e34;
        }
        
        .icon {
          margin-right: 5px;
        }
        
        .filters {
          display: flex;
          gap: 10px;
        }
        
        .filter-select {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
          font-size: 14px;
        }
        
        .verification-content {
          min-height: 400px;
        }
        
        .progress-section {
          margin-bottom: 30px;
        }
        
        .progress-bar {
          width: 100%;
          height: 8px;
          background: #f0f0f0;
          border-radius: 4px;
          overflow: hidden;
        }
        
        .progress-fill {
          height: 100%;
          background: #007acc;
          width: 0%;
          transition: width 0.3s ease;
        }
        
        .progress-text {
          margin-top: 10px;
          font-size: 14px;
          color: #666;
          text-align: center;
        }
        
        .results-header {
          margin-bottom: 20px;
        }
        
        .results-header h3 {
          margin: 0 0 15px 0;
          color: #333;
        }
        
        .stats {
          display: flex;
          gap: 20px;
          margin-bottom: 15px;
        }
        
        .stat-item {
          font-size: 14px;
          color: #666;
        }
        
        .stat-value {
          font-weight: bold;
          color: #333;
        }
        
        .stat-value.passed {
          color: #28a745;
        }
        
        .stat-value.failed {
          color: #dc3545;
        }
        
        .results-grid {
          display: grid;
          gap: 20px;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        }
        
        .no-results {
          grid-column: 1 / -1;
          text-align: center;
          padding: 60px 20px;
          color: #999;
          font-style: italic;
        }
        
        .test-result {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 15px;
          background: white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .test-result.passed {
          border-left: 4px solid #28a745;
        }
        
        .test-result.failed {
          border-left: 4px solid #dc3545;
        }
        
        .test-result-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        
        .test-title {
          font-weight: bold;
          color: #333;
          font-size: 16px;
        }
        
        .test-status {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }
        
        .test-status.passed {
          background: #d4edda;
          color: #155724;
        }
        
        .test-status.failed {
          background: #f8d7da;
          color: #721c24;
        }
        
        .test-environment {
          font-size: 12px;
          color: #666;
          margin-bottom: 8px;
        }
        
        .test-details {
          margin-bottom: 10px;
        }
        
        .test-performance {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #666;
        }
        
        .verification-footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e0e0e0;
        }
        
        .help-text {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 6px;
          font-size: 14px;
          line-height: 1.5;
        }
        
        @media (max-width: 768px) {
          .verification-container {
            padding: 10px;
          }
          
          .controls {
            flex-direction: column;
            align-items: stretch;
          }
          
          .filters {
            flex-direction: column;
          }
          
          .results-grid {
            grid-template-columns: 1fr;
          }
        }
      </style>
    `;
    
    this.attachEventListeners();
  }
  
  private attachEventListeners(): void {
    const runBtn = this.querySelector('#run-tests') as HTMLButtonElement;
    const exportBtn = this.querySelector('#export-results') as HTMLButtonElement;
    const browserFilter = this.querySelector('#browser-filter') as HTMLSelectElement;
    const osFilter = this.querySelector('#os-filter') as HTMLSelectElement;
    const statusFilter = this.querySelector('#status-filter') as HTMLSelectElement;
    
    runBtn.addEventListener('click', () => this.runTests());
    exportBtn.addEventListener('click', () => this.exportResults());
    
    browserFilter.addEventListener('change', (e) => {
      this.filterSettings.browser = (e.target as HTMLSelectElement).value;
      this.filterResults();
    });
    
    osFilter.addEventListener('change', (e) => {
      this.filterSettings.os = (e.target as HTMLSelectElement).value;
      this.filterResults();
    });
    
    statusFilter.addEventListener('change', (e) => {
      this.filterSettings.status = (e.target as HTMLSelectElement).value;
      this.filterResults();
    });
  }
  
  private async runTests(): Promise<void> {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.updateUIForRunning();
    
    try {
      const results = await runAutomatedVerification();
      this.currentResults = results;
      
      // Update case files based on results
      await this.updateCaseFiles(results);
      
      this.renderResults(results);
      
    } catch (error) {
      console.error('Test execution failed:', error);
      this.showError('Test execution failed. Please check console for details.');
    } finally {
      this.isRunning = false;
      this.updateUIForComplete();
    }
  }
  
  private updateUIForRunning(): void {
    const runBtn = this.querySelector('#run-tests') as HTMLButtonElement;
    const progressSection = this.querySelector('#progress-section') as HTMLElement;
    const progressText = this.querySelector('#progress-text') as HTMLElement;
    const progressFill = this.querySelector('#progress-fill') as HTMLElement;
    
    runBtn.disabled = true;
    runBtn.innerHTML = '<span class="icon">⏸</span> Running...';
    progressSection.style.display = 'block';
    progressText.textContent = 'Initializing test environment...';
    progressFill.style.width = '5%';
  }
  
  private updateUIForComplete(): void {
    const runBtn = this.querySelector('#run-tests') as HTMLButtonElement;
    const progressSection = this.querySelector('#progress-section') as HTMLElement;
    
    runBtn.disabled = false;
    runBtn.innerHTML = '<span class="icon">▶</span> Run All Tests';
    progressSection.style.display = 'none';
  }
  
  private renderResults(results: any[]): void {
    const resultsGrid = this.querySelector('#results-grid') as HTMLElement;
    const totalTestsEl = this.querySelector('#total-tests') as HTMLElement;
    const passedTestsEl = this.querySelector('#passed-tests') as HTMLElement;
    const failedTestsEl = this.querySelector('#failed-tests') as HTMLElement;
    
    // Calculate statistics
    const totalTests = results.length;
    const passedTests = results.filter(r => r.passed).length;
    const failedTests = totalTests - passedTests;
    
    totalTestsEl.textContent = totalTests.toString();
    passedTestsEl.textContent = passedTests.toString();
    failedTestsEl.textContent = failedTests.toString();
    
    // Clear existing results
    resultsGrid.innerHTML = '';
    
    if (results.length === 0) {
      resultsGrid.innerHTML = `
        <div class="no-results">
          <p>No test results available. Run tests to see results.</p>
        </div>
      `;
      return;
    }
    
    // Render results
    const filteredResults = this.filterResultsList(results);
    
    filteredResults.forEach(result => {
      const resultElement = this.createResultElement(result);
      resultsGrid.appendChild(resultElement);
    });
  }
  
  private createResultElement(result: any): HTMLElement {
    const element = document.createElement('div');
    element.className = `test-result ${result.passed ? 'passed' : 'failed'}`;
    
    const statusClass = result.passed ? 'passed' : 'failed';
    const statusText = result.passed ? 'PASSED' : 'FAILED';
    
    element.innerHTML = `
      <div class="test-result-header">
        <div class="test-title">${result.caseTitle || result.caseId}</div>
        <div class="test-status ${statusClass}">${statusText}</div>
      </div>
      
      <div class="test-environment">
        ${result.environment.browser} ${result.environment.os} ${result.environment.device}
      </div>
      
      <div class="test-details">
        <strong>Expected:</strong> ${result.expectedBehavior}<br>
        <strong>Actual:</strong> ${result.actualBehavior}<br>
        <strong>Details:</strong> ${result.details}
      </div>
      
      <div class="test-performance">
        <span>Duration: ${result.performance.duration.toFixed(2)}ms</span>
        <span>Memory: ${(result.performance.memoryUsage / 1024 / 1024).toFixed(2)}MB</span>
        <span>Reproducibility: ${result.reproducibility}</span>
        <span>Confidence: ${result.confidence}%</span>
      </div>
    `;
    
    return element;
  }
  
  private filterResults(): void {
    this.renderResults(this.currentResults);
  }
  
  private filterResultsList(results: any[]): any[] {
    return results.filter(result => {
      const browserMatch = this.filterSettings.browser === 'all' || 
                         result.environment.browser.toLowerCase() === this.filterSettings.browser.toLowerCase();
      
      const osMatch = this.filterSettings.os === 'all' || 
                     result.environment.os.toLowerCase() === this.filterSettings.os.toLowerCase();
      
      const statusMatch = this.filterSettings.status === 'all' || 
                        (this.filterSettings.status === 'passed' && result.passed) ||
                        (this.filterSettings.status === 'failed' && !result.passed) ||
                        (this.filterSettings.status === 'low-confidence' && result.confidence < 50);
      
      return browserMatch && osMatch && statusMatch;
    });
  }
  
  private async updateCaseFiles(results: any[]): Promise<void> {
    // Update case status in markdown files based on results
    console.log('Updating case files based on verification results...');
    
    // In a real implementation, this would:
    // 1. Group results by case ID
    // 2. For each case, determine if it should be confirmed or remain draft
    // 3. Update the frontmatter of corresponding .md files
    // 4. Consider reproducibility and confidence scores
    
    const resultsByCase = new Map<string, any[]>();
    
    results.forEach(result => {
      if (!resultsByCase.has(result.caseId)) {
        resultsByCase.set(result.caseId, []);
      }
      resultsByCase.get(result.caseId)!.push(result);
    });
    
    // Log what would be updated
    resultsByCase.forEach((caseResults, caseId) => {
      const passedTests = caseResults.filter(r => r.passed).length;
      const totalTests = caseResults.length;
      const confidenceScore = caseResults.reduce((sum, r) => sum + r.confidence, 0) / totalTests;
      
      const shouldConfirm = passedTests >= Math.ceil(totalTests * 0.8) && confidenceScore >= 70;
      
      console.log(`Case ${caseId}: ${shouldConfirm ? 'CONFIRM' : 'DRAFT'} - ${passedTests}/${totalTests} passed, ${confidenceScore.toFixed(1)}% confidence`);
    });
  }
  
  private exportResults(): void {
    if (this.currentResults.length === 0) {
      alert('No results to export. Run tests first.');
      return;
    }
    
    const report = this.generateReport();
    
    // Create download link
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `verification-report-${new Date().toISOString().split('T')[0]}.md`;
    link.click();
    
    URL.revokeObjectURL(url);
  }
  
  private generateReport(): string {
    const passedTests = this.currentResults.filter(r => r.passed).length;
    const totalTests = this.currentResults.length;
    const passRate = totalTests > 0 ? (passedTests / totalTests * 100).toFixed(1) : '0';
    
    let report = `# ContentEditable Case Verification Report\n\n`;
    report += `Generated: ${new Date().toISOString()}\n`;
    report += `Total Tests: ${totalTests}\n`;
    report += `Passed: ${passedTests}\n`;
    report += `Failed: ${totalTests - passedTests}\n`;
    report += `Pass Rate: ${passRate}%\n\n`;
    
    // Group results by case
    const resultsByCase = new Map<string, any[]>();
    this.currentResults.forEach(result => {
      if (!resultsByCase.has(result.caseId)) {
        resultsByCase.set(result.caseId, []);
      }
      resultsByCase.get(result.caseId)!.push(result);
    });
    
    resultsByCase.forEach((results, caseId) => {
      report += `## Case ${caseId}\n\n`;
      
      results.forEach(result => {
        const status = result.passed ? '✅ PASS' : '❌ FAIL';
        report += `### ${result.environment.browser} on ${result.environment.os} ${status}\n\n`;
        report += `**Expected:** ${result.expectedBehavior}\n\n`;
        report += `**Actual:** ${result.actualBehavior}\n\n`;
        report += `**Details:** ${result.details}\n\n`;
        report += `**Performance:** ${result.performance.duration.toFixed(2)}ms\n\n`;
        report += `**Reproducibility:** ${result.reproducibility}\n\n`;
        report += `**Confidence:** ${result.confidence}%\n\n`;
        report += `---\n\n`;
      });
    });
    
    return report;
  }
  
  private showError(message: string): void {
    const alert = document.createElement('div');
    alert.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #dc3545;
      color: white;
      padding: 15px;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      max-width: 300px;
    `;
    
    alert.textContent = message;
    document.body.appendChild(alert);
    
    setTimeout(() => {
      if (alert.parentNode) {
        alert.parentNode.removeChild(alert);
      }
    }, 5000);
  }
}

// Register the custom element
customElements.define('case-verification-ui', CaseVerificationUI);

export default CaseVerificationUI;