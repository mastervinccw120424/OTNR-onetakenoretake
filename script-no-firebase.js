// Original UI working version - no Firebase (test tabs first)
let currentPage = 'landingPage';
let currentUser = null;
let currentDashboard = null;
let nH
// Show page
function showPage(pageId, skipHistory = false) {
  document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
  const page = document.getElementById(pageId);
  if (page) {
    page.classList.add('active');
    currentPage = pageId;
    if (!skipHistory) navigationHistory.push(pageId);
    window.scrollTo(0, 0);
  }
}

// Back
function goBack() {
  if (navigationHistory.length <= 1) return showPage('landingPage');
  navigationHistory.pop();
  showPage(navigationHistory[navigationHistory.length - 1] || 'landingPage', true);
}

// Tab switch - CRITICAL TEST
function switchAuthTab(tab) {
  console.log('🔄 Tab:', tab);
  document.querySelectorAll('.auth-tab-content').forEach(c => c.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  
  document.getElementById(tab + 'Tab').classList.add('active');
  document.querySelector(`[onclick="switchAuthTab('${tab}')"]`).classList.add('active');
  console.log('✅ Tab switched');
}

// Fake login/signup for UI test
function loginUser() {
  showToast('✅ Login demo', 'success');
  showPage('courseSelectionPage');
}

function createAccount() {
  showToast('✨ Signup demo', 'success');
  showPage('courseSelectionPage');
}

// Course
function selectCourse(type) {
  currentDashboard = type === 'genEd' ? 'genEdDashboard' : 'profEdDashboard';
  showPage(currentDashboard);
}

function takeQuiz(topic) { showToast(`📚 ${topic}`, 'info'); }

function openSettings() {
  document.getElementById('displayName').value = 'Demo User';
  showPage('accountSettingsPage');
}

function showToast(msg, type) {
  const toast = document.createElement('div');
  toast.textContent = msg;
  toast.className = `toast active toast-${type}`;
  setTimeout(() => toast.classList.remove('active'), 3000);
}

if (typeof document !== 'undefined') {
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 UI Test Ready - Click Create Account button!');
  showPage('landingPage');
});
}
