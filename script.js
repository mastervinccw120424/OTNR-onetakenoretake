// Complete working Firebase + UI script
// Back button + Auth FIXED

// Firebase CDN globals
let app, auth, analytics;

// Wait for Firebase
if (typeof window !== 'undefined') {
window.addEventListener('load', async () => {
  const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js');
  const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } = await import('https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js');
  
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  
  console.log('✅ Firebase loaded');
  
  // Auth listener
  onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUser = { 
        uid: user.uid,
        email: user.email,
        name: user.displayName || user.email.split('@')[0],
        major: localStorage.getItem(`major_${user.uid}`) || 'General'
      };
      if (currentPage === 'landingPage') showPage('courseSelectionPage');
    } else {
      currentUser = null; 
      showPage('landingPage');
    }
  });
});
}

// App state
let currentPage = 'landingPage'; 
let currentUser = null;
let currentDashboard = null;
let navigationHistory = ['landingPage'];

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

// Back navigation
function goBack() {
  if (navigationHistory.length <= 1) {
    showPage('landingPage'); 
    return;
  }
  
  if (currentPage === 'accountSettingsPage') {
    showPage(currentDashboard || 'courseSelectionPage', true);
    return;
  }
  
  navigationHistory.pop(); 
  showPage(navigationHistory[navigationHistory.length - 1] || 'landingPage', true);
}

// Tab switching - FIXED
function switchAuthTab(tab) {
  console.log('Switching to:', tab);
  
  // Hide all
  document.querySelectorAll('.auth-tab-content').forEach(content => content.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
   
  // Show selected
  document.getElementById(tab + 'Tab').classList.add('active');
  document.querySelector(`[onclick="switchAuthTab('${tab}')"]`).classList.add('active');
}

// Login
async function loginUser() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim(); 
  
  if (!email || !password) return showToast('❌ Fill all fields', 'error');
  
  try {
    showToast('🔄 Signing in...', 'info');
    const result = await signInWithEmailAndPassword(auth, email, password);
    showToast('✅ Welcome back!', 'success');
    document.getElementById('loginEmail').value = ''; 
    document.getElementById('loginPassword').value = '';
    setTimeout(() => showPage('courseSelectionPage'), 1000);
  } catch (error) {
    console.error(error);
    showToast('❌ ' + error.message, 'error');
  }
}

// Signup
async function createAccount() {
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const major = document.getElementById('signupMajor').value; 
  const password = document.getElementById('signupPassword').value.trim();
  
  if (!name || !email || !major || !password) return showToast('❌ Fill all fields', 'error');
  if (password.length < 6) return showToast('❌ Password 6+ chars', 'error');
  
  try {
    showToast('🔄 Creating account...', 'info');
    const result = await createUserWithEmailAndPassword(auth, email, password);
    currentUser.major = major; 
    localStorage.setItem(`major_${result.user.uid}`, major);
    showToast('✨ Account created!', 'success');
    
    // Clear form
    document.getElementById('signupName').value = '';
    document.getElementById('signupEmail').value = '';
    document.getElementById('signupMajor').value = '';
    document.getElementById('signupPassword').value = '';
    
    setTimeout(() => showPage('courseSelectionPage'), 1000);
  } catch (error) {
    console.error(error);
    showToast('❌ ' + error.message, 'error');
  }
}

// Course selection
function selectCourse(type) {
  currentDashboard = type === 'genEd' ? 'genEdDashboard' : 'profEdDashboard'; 
  showPage(currentDashboard);
}

// Quiz Engine State - FULL IMPLEMENTATION
let currentQuizData = [];
let currentQuestionIndex = 0;
let quizScore = 0;
let quizTimerInterval; 
let timeLeft = 60;
let activeQuizTopic = "";

const quizzes = {
  "The Teaching Profession": [
    { q: "Which of the following is NOT in the norms of conduct under RA 6713?", options: ["Professionalism", "Commitment to the public interest", "Justness and sincerity", "Responsiveness to the private"], correct: 3, exp: "RA 6713 specifies responsiveness to the PUBLIC, not private interests." },
    { q: "Mr. Santos is a holder of a valid certificate of eligibility as a teacher... while Mr. Cruz is a registered professional. Who is allowed to practice?", options: ["Mr. Santos only", "Both of them", "Neither of the two", "Mr. Cruz only"], correct: 1, exp: "Both credentials are legally recognized for practicing the teaching profession." },
    { q: "Is membership in the accredited professional organization for teachers mandatory for all LET passers?", options: ["Yes, when teaching", "No", "Only for first-timers", "Yes"], correct: 1, exp: "Current regulations often clarify the distinction between passing the board and mandatory active membership requirements." },
    { q: "Teacher Rochelle affirms that being a teacher is a task entrusted by this world. She believes teaching is a _______?", options: ["Profession", "Mission", "Bread butter", "Vocation"], correct: 1, exp: "A 'task entrusted' defines teaching as a Mission." },
    { q: "Teacher S has been accused of sexual harassment by a student. What should the school principal do?", options: ["Suspend immediately", "Ask to surrender", "Create a committee to investigate", "Advise transfer"], correct: 2, exp: "Due process requires a formal investigation through a committee." },
    { q: "To ensure high standards of teachers' development, which measure must be implemented?", options: ["I and III", "II only", "II and III", "I only"], correct: 2, exp: "Personal development plans (II) and monitoring (III) are essential for quality standards." },
    { q: "The results of the LET revealed low performance (15% BEED, 25% BSED). What do the results imply?", options: ["More BEED training", "Determine specialization", "Selective admission", "Review curriculum vis-a-vis TOS"], correct: 3, exp: "Consistently low results point to a need for curriculum alignment with the Table of Specifications (TOS)." },
    { q: "What norm of conduct is manifested by being loyal to the republic and the Filipino people?", options: ["Professionalism", "Honesty", "Nationalism and Patriotism", "Responsiveness"], correct: 2, exp: "Loyalty to the state and people is the definition of Nationalism and Patriotism." },
    { q: "What are the job-embedded requirements for teachers to continuously develop?", options: ["II, III, IV", "I, III, IV", "I, II, III", "I, II, III, IV"], correct: 3, exp: "Records, research, relationships, and guidance are all core job-embedded requirements." },
    { q: "What is meant by the acronym NCBTS?", options: ["National Competency-Basic Teacher Standards", "National Competency-Based Teaching Standards", "National Competency-Basic Teaching Standards", "National Competency-Based Teacher Standards"], correct: 3, exp: "NCBTS stands for National Competency-Based Teacher Standards." },
    { q: "Which manifests 'Commitment to democracy' as explained in RA 6713?", options: ["Democratic values", "Accountability", "Supremacy of civilian authority", "All of these"], correct: 3, exp: "All these points are explicitly mentioned as manifestations of commitment to democracy." },
    { q: "Which is the most appropriate characteristics of a globally competent individual?", options: ["Open-mindedness", "Foreign-language policy", "Adaptability to new work environment", "Familiarity"], correct: 2, exp: "Global competence heavily emphasizes high levels of adaptability." },
    { q: "Teacher H contracted an illness requiring rest for more than one year. Which leave should she apply for?", options: ["Personal leave", "Sick leave", "Vacation leave", "Indefinite leave"], correct: 3, exp: "Indefinite leave is applicable for prolonged health issues exceeding a year." },
    { q: "Teacher Toni is in a relationship with his student. Is this allowed?", options: ["No at all times", "Yes, with professional discretion", "Yes, be proud", "No, unless permitted"], correct: 1, exp: "The Code of Ethics allows relationships but demands the highest professional discretion to avoid preferential treatment." },
    { q: "Teacher M experiences difficulty in speech. Which would be affected if he continues teaching?", options: ["Punctuality", "Personality", "Devotion", "Effectiveness"], correct: 3, exp: "Communication is the primary tool for teaching; difficulty in speech directly impacts teaching effectiveness." }
  ],
  "Philippine History": [
    { q: "What year did the Philippines gain independence from Spain?", options: ["1898", "1946", "1935", "1521"], correct: 0, exp: "June 12, 1898 - Declaration of Independence by Gen. Emilio Aguinaldo." },
    { q: "Who was the first President of the Philippine Republic?", options: ["Manuel Quezon", "Jose Laurel", "Emilio Aguinaldo", "Sergio Osmeña"], correct: 2, exp: "Emilio Aguinaldo was the first and only president of the First Philippine Republic (1899-1901)." },
    { q: "The Blood Compact was between Rajah Sikatuna and?", options: ["Magellan", "Legaspi", "Rizal", "Bonifacio"], correct: 1, exp: "Miguel López de Legazpi and Rajah Sikatuna in Bohol, 1565." },
    { q: "What is the national hero known as the 'Great Malayan'?", options: ["Bonifacio", "Aguinaldo", "Rizal", "Lapu-Lapu"], correct: 2, exp: "José Rizal was called the 'Great Malayan' by Dr. W. E. Retana." }
  ],
  "Ethics": [
    { q: "Which ethical theory focuses on duty regardless of consequences?", options: ["Utilitarianism", "Deontology", "Virtue Ethics", "Relativism"], correct: 1, exp: "Deontology (Kant) emphasizes moral duty and rules." },
    { q: "The greatest good for the greatest number is principle of?", options: ["Deontology", "Utilitarianism", "Existentialism", "Stoicism"], correct: 1, exp: "Utilitarianism (Bentham/Mill) - maximize overall happiness." }
  ],
  "Malayuning Komunikasyon": [
    { q: "Ano ang tawag sa proseso ng pagpapadala at pagtanggap ng mensahe sa pamamagitan ng mga simbolikong cues na maaaring berbal o di-berbal?", options: ["Diskuro", "Komunikasyon", "Sintaksis", "Pragmatiks"], correct: 1, exp: "Ito ang pangunahing kahulugan ng komunikasyon." },
    { q: "Sa anong antas ng komunikasyon kabilang ang pakikipag-usap sa sarili, tulad ng pagmumuni-muni o pagdedesisyon?", options: ["Interpersonal", "Intrapersonal", "Pampubliko", "Pang-organisasyon"], correct: 1, exp: "Intra - sa loob ng sarili." },
    { q: "Aling elemento ng komunikasyon ang tumutukoy sa tugon o reaksyon ng tagatanggap sa mensaheng ipinadala ng tagahatid?", options: ["Tsanel", "Konteksto", "Feedback (Mensaheng Balik)", "Ingay (Noise)"], correct: 2, exp: "Ito ang nagpapatunay kung naintindihan ang mensahe." },
    { q: "Sa modelong S-M-C-R ni Berlo, ano ang kinakatawan ng titik \"C\"?", options: ["Content (Nilalaman)", "Channel (Tsanel/Daluyan)", "Context (Konteksto)", "Code (Koda)"], correct: 1, exp: "Source-Message-Channel-Receiver." },
    { q: "Anong uri ng di-berbal na komunikasyon ang gumagamit ng espasyo o agwat sa pagitan ng mga taong nag-uusap?", options: ["Kinesika (Kinesics)", "Haptika (Haptics)", "Proksimika (Proxemics)", "Kronemika (Chronemics)"], correct: 2, exp: "Ito ay pag-aaral ng komunikatibong gamit ng espasyo." },
    { q: "Ang paghaplos sa balikat ng isang kaibigang nagdadalamhati ay isang halimbawa ng anong uri ng di-berbal na komunikasyon?", options: ["Oculesics", "Haptics (Paghipo)", "Paralanguage", "Objectics"], correct: 1, exp: "Haptika ang paggamit ng paghipo sa paghahatid ng mensahe." },
    { q: "Aling tungkulin ng wika ayon kay M.A.K. Halliday ang ginagamit upang kontrolin ang pangyayari o ang paggawi ng ibang tao?", options: ["Interaksyonal", "Instrumental", "Regulatori", "Personal"], correct: 2, exp: "Halimbawa nito ang mga babala o panuto." },
    { q: "Ano ang tawag sa paggamit ng wika kung saan ang layunin ay mapanatili ang relasyong sosyal sa kapwa, gaya ng pangungumusta?", options: ["Heuristiko", "Interaksyonal", "Imahinatibo", "Representasyonal"], correct: 1, exp: "Pakikipagkapwa-tao ang pokus nito." },
    { q: "Sa pagsulat ng akademikong papel, anong uri ng tono ang dapat gamitin?", options: ["Impormal at Kolokyal", "Obhetibo at Pormal", "Masining at Matayutay", "Subhetibo at Emosyonal"], correct: 1, exp: "Kailangas nakabatay sa katotohanan at pormal ang wika." },
    { q: "Aling uri ng ingay (noise) ang tumutukoy sa pagkakaroon ng magkaibang kahulugan ng salita para sa tagahatid at tagatanggap?", options: ["Pisikal na ingay", "Sikolohikal na ingay", "Semantikong ingay", "Pisyolohikal na ingay"], correct: 2, exp: "Nagmumula sa maling interpretasyon ng salita." },
    { q: "Ang pagtayo nang tuwid at pagkumpas ng kamay habang nagtatalumpati ay kabilang sa anong anyo ng komunikasyon?", options: ["Kinesics (Galaw ng Katawan)", "Iconics", "Colorics", "Vocalics"], correct: 0, exp: "Pag-aaral ng galaw ng katawan, postura, at kumpas." },
    { q: "Ano ang terminong ginagamit sa paglilipat ng mensahe mula sa isang wika tungo sa isa pang wika habang pinananatili ang diwa nito?", options: ["Pagbaybay", "Pagsasaling-wika", "Transliterasyon", "Sintesis"], correct: 1, exp: "Pagsasalin ang tawag sa prosesong ito." },
    { q: "Aling kasanayang pangwika ang itinuturing na \"aktibong pagtanggap\" ng mensahe?", options: ["Pagsasalita", "Pagsulat", "Pakikinig", "Panonood"], correct: 2, exp: "Ito ay isang aktibong proseso ng pag-unawa sa naririnig." },
    { q: "Anong uri ng komunikasyon ang nagaganap sa pagitan ng dalawang tao o sa isang maliit na pangkat?", options: ["Interpersonal", "Mass Communication", "Intrapersonal", "Mediated Communication"], correct: 0, exp: "Inter - sa pagitan ng mga tao." },
    { q: "Ang paggamit ng \"po\" at \"opo\" bilang tanda ng paggalang ay bahagi ng anong aspeto ng komunikatibong kakayahan?", options: ["Kakayahang Lingguwistiko", "Kakayahang Sosyolingguwistiko", "Kakayahang Diskorsal", "Kakayahang Istratedyik"], correct: 1, exp: "Ito ay pag-angkop ng wika base sa kultura at kontekstong sosyal." },
    { q: "Alin sa mga sumusunod ang tumutukoy sa komunikasyong nagaganap gamit ang teknolohiya tulad ng computer o smartphone?", options: ["Intrapersonal", "Computer-Mediated Communication (CMC)", "Face-to-Face Communication", "Small Group Communication"], correct: 1, exp: "Computer-Mediated Communication refers to human communication through electronic devices." },
    { q: "Ano ang tawag sa pag-aaral ng oras sa komunikasyon, tulad ng pagiging huli sa isang appointment?", options: ["Proxemics", "Haptics", "Chronemics", "Kinesics"], correct: 2, exp: "Chronemics is the study of the role of time in communication." },
    { q: "Aling barayti ng wika ang ginagamit sa isang partikular na rehiyon o lalawigan?", options: ["Sosyolek", "Idyolek", "Dayalekto", "Register"], correct: 2, exp: "Dayalekto is a regional variety of a language." },
    { q: "Ano ang tawag sa \"lingua franca\" o pambansang wika ng mga Pilipino?", options: ["Tagalog", "Cebuano", "Filipino", "Ingles"], correct: 2, exp: "Filipino is the national language of the Philippines." },
    { q: "Sa komunikasyon, ano ang tawag sa literal na kahulugan ng salita na matatagpuan sa diksyunaryo?", options: ["Konotasyon", "Denotasyon", "Pragmatiks", "Semantika"], correct: 1, exp: "Denotation is the direct, explicit, or dictionary meaning of a word." },
    { q: "Anong uri ng komunikasyon ang naglalayong magbigay ng impormasyon sa malawak na madla sa pamamagitan ng media gaya ng telebisyon?", options: ["Interpersonal", "Mass Communication", "Intrapersonal", "Organisasyonal"], correct: 1, exp: "Mass Communication exchanges info on a large scale via various media." },
    { q: "Alin sa mga sumusunod ang halimbawa ng pormal na komunikasyon?", options: ["Tsismisan sa kanto", "Pagtetext sa kaibigan", "Pagbibigay ng ulat sa pulong (Meeting)", "Pakikipag-usap sa palengke"], correct: 2, exp: "Formal communication follows established professional standards." },
    { q: "Ano ang tawag sa sagabal na may kinalaman sa emosyon o mental na estado ng tao, tulad ng pagkapagod o stress?", options: ["Pisyolohikal", "Sikolohikal", "Pisikal", "Semantiko"], correct: 1, exp: "Psychological noise refers to mental or emotional factors that interfere with a message." },
    { q: "Aling tungkulin ng wika ang ginagamit sa pagkuha o paghahanap ng impormasyon, gaya ng pagtatanong o pananaliksik?", options: ["Heuristiko", "Representasyonal", "Instrumental", "Personal"], correct: 0, exp: "Heuristic function of language is used to gain knowledge and learn." },
    { q: "Ano ang tawag sa kasanayang pangwika na tumutukoy sa pagsasalin ng iniisip o nadarama sa pamamagitan ng mga simbolo?", options: ["Pakikinig", "Pagsasalita", "Pagbabasa", "Pagsusulat"], correct: 3, exp: "Writing involves encoding ideas into text or graphic symbols." },
    { q: "Alin sa mga sumusunod ang nagpapakita ng \"Interkultural na Komunikasyon\"?", options: ["Pag-uusap ng dalawang magkapatid.", "Pakikipagnegosasyon ng isang Pilipino sa isang Hapones.", "Pagbabasa ng sariling talaarawan.", "Panonood ng balita sa lokal na channel."], correct: 1, exp: "Intercultural communication occurs when people from different backgrounds exchange messages." },
    { q: "Ano ang ibig sabihin ng \"Register\" ng wika?", options: ["Listahan ng mga bagong salita.", "Pag-aangkop ng wika base sa propesyon.", "Paglilista ng mga pangalan.", "Wikang ginagamit lamang sa bahay."], correct: 1, exp: "Register is a variety of language used for a particular purpose or setting." },
    { q: "Anong aspeto ng di-berbal na komunikasyon ang tumutukoy sa tono, bilis, at lakas ng boses?", options: ["Kinesics", "Paralanguage (Vocalics)", "Proxemics", "Chronemics"], correct: 1, exp: "Paralanguage refers to non-lexical components of speech like intonation." },
    { q: "Aling bahagi ng modelong komunikasyon ang nagsisilbing daanan ng mensahe?", options: ["Tagahatid", "Mensahe", "Tsanel (Channel)", "Feedback"], correct: 2, exp: "The Channel is the medium through which a message is transmitted." },
    { q: "Ano ang tawag sa komunikasyong nagaganap sa loob ng isang kumpanya o ahensya?", options: ["Interkultural", "Organisasyonal", "Pangmadla", "Intrapersonal"], correct: 1, exp: "Organizational Communication involves info flow within a structured environment." },
    { q: "Alin ang katangian ng \"Kakayahang Istratedyik\"?", options: ["Pagkabisado ng diksyunaryo.", "Paggamit ng paraan upang hindi maputol ang komunikasyon.", "Pagsulat ng tula.", "Pag-unawa sa kasaysayan."], correct: 1, exp: "Strategic Competence is the ability to compensate for breakdowns in communication." },
    { q: "Ano ang tawag sa masining na pagpapahayag na hindi direkta ang kahulugan, gaya ng mga idyoma?", options: ["Denotasyon", "Matayutay na pahayag", "Teknikal na pagsulat", "Direkta na komunikasyon"], correct: 1, exp: "Figurative language (Matayutay) moves beyond literal meanings." },
    { q: "Anong uri ng pakikinig ang layunin ay magbigay ng payo o makiramay?", options: ["Kritikal", "Empatikong Pakikinig", "Deskriminatibo", "Pasibo"], correct: 1, exp: "Empathetic Listening involves understanding the feelings of the speaker." },
    { q: "Ano ang tawag sa barayti ng wika na nabubuo dahil sa pangangailangan ng dalawang taong may magkaibang wika?", options: ["Creole", "Pidgin", "Sosyolek", "Etnolek"], correct: 1, exp: "A Pidgin is a simplified language for communication between groups." },
    { q: "Kapag ang isang Pidgin ay naging likas na wika na ng isang komunidad, ano ang tawag dito?", options: ["Dayalekto", "Idyolek", "Creole", "Sosyolek"], correct: 2, exp: "A Creole is a stable natural language developed from the mixing of parent languages." },
    { q: "Ano ang tawag sa komunikasyong gumagamit ng mga larawan o simbolo gaya ng traffic signs?", options: ["Iconics", "Vocalics", "Haptics", "Chronemics"], correct: 0, exp: "Iconics involves icons or symbols representing messages." },
    { q: "Aling uri ng pagsulat ang naglalayong magbigay ng ulat o instruksyon sa isang propesyonal na larangan?", options: ["Malikhain", "Teknikal na Pagsulat", "Dyornalistik", "Reperensyal"], correct: 1, exp: "Technical Writing provides complex info clearly to a specific audience." },
    { q: "Sa etika ng komunikasyon, ano ang tinutukoy ng \"Integridad\"?", options: ["Mamahaling kagamitan.", "Pagiging matapat at pagkakaroon ng moral na prinsipyo.", "Maraming followers.", "Ingles lamang."], correct: 1, exp: "Integrity means being honest and ethical in presenting info." },
    { q: "Alin sa mga sumusunod ang halimbawa ng \"Sikolohikal na Ingay\"?", options: ["Busina ng sasakyan.", "Maling baybay.", "Pag-iisip ng problema habang may nakikipag-usap.", "Sirang mikropono."], correct: 2, exp: "Psychological noise includes wandering thoughts or emotions." },
    { q: "Ano ang tawag sa kakayahang pagsama-samahin ang mga pangungusap upang makabuo ng lohikal na teksto?", options: ["Lingguwistiko", "Sosyolingguwistiko", "Kakayahang Diskorsal", "Istratedyik"], correct: 2, exp: "Discourse Competence is the ability to combine sentences into cohesive blocks." },
    { q: "Ang pag-aaral ng galaw ng mata bilang komunikasyon ay tinatawag na:", options: ["Oculesics", "Olfactics", "Gustics", "Haptics"], correct: 0, exp: "Oculesics is the study of eye movement as non-verbal communication." },
    { q: "Aling tungkulin ng wika ang ginagamit sa paglikha ng mga kwento at tula?", options: ["Heuristiko", "Imahinatibo", "Interaksyonal", "Regulatori"], correct: 1, exp: "Imaginative function is used for artistic expressions or fictional worlds." },
    { q: "Ano ang tawag sa barayti ng wika na ginagamit ng mga etnolinggwistikong grupo?", options: ["Sosyolek", "Idyolek", "Etnolek", "Register"], correct: 2, exp: "Ethnolekt is a variety of language spoken by a specific ethnic group." },
    { q: "Alin sa mga sumusunod ang \"Pisyolohikal na Sagabal\"?", options: ["Maingay na site.", "Kapansanan sa pandinig (hearing impairment).", "Kultura.", "Maling bantas."], correct: 1, exp: "Physiological barriers are biological conditions like illness or disability." },
    { q: "Ano ang tawag sa proseso ng pag-unawa at pagbigay-interpretasyon sa mga nabasang simbolo?", options: ["Pagsulat", "Pagbabasa", "Pakikinig", "Pagsasalita"], correct: 1, exp: "Reading is the cognitive process of decoding symbols from text." },
    { q: "Aling uri ng komunikasyon ang karaniwang ginagamitan ng mga \"mass media channels\"?", options: ["Intrapersonal", "Interpersonal", "Public", "Mass Communication"], correct: 3, exp: "Mass Communication relies on technology to relay info to a large audience." },
    { q: "Ano ang pangunahing layunin ng \"Perswadibong Komunikasyon\"?", options: ["Mang-aliw", "Magbigay ng impormasyon", "Manghikayat o magpabago ng paniniwala", "Magpahayag ng galit"], correct: 2, exp: "Persuasive communication influences audience attitudes or behaviors." },
    { q: "Ang paggamit ng \"Bekimon\" o \"Jargon\" ay halimbawa ng anong barayti ng wika?", options: ["Dayalekto", "Sosyolek", "Idyolek", "Etnolek"], correct: 1, exp: "Sociolect is a social dialect used by a specific group." },
    { q: "Aling elemento ng komunikasyon ang tumutukoy sa lugar, oras, at sitwasyon?", options: ["Mensahe", "Tsanel", "Konteksto", "Feedback"], correct: 2, exp: "Context includes the setting and environment of the communication." },
    { q: "Bakit mahalaga ang \"Malayuning Komunikasyon\"?", options: ["Makapanloko.", "Maging epektibo at etikal ang paghahatid ng mensahe.", "Pagsasalita.", "Makaiwas sa iba."], correct: 1, exp: "It is vital for achieving goals efficiently and ethically across contexts." }
  ]
};

// Quiz Functions
function takeQuiz(topic) {
  if (!quizzes[topic]) return showToast("Quiz content coming soon!", "info");
  activeQuizTopic = topic;
  currentQuizData = [...quizzes[topic]];
  currentQuestionIndex = 0;
  quizScore = 0;
  showPage('quizPage');
  loadQuestion();
}

function loadQuestion() {
  const question = currentQuizData[currentQuestionIndex];
  document.getElementById('quizProgress').textContent = `${currentQuestionIndex + 1}/${currentQuizData.length}`;
  document.getElementById('questionText').textContent = question.q;
  
  const optionsContainer = document.getElementById('quizOptions');
  optionsContainer.innerHTML = '';
  
  question.options.forEach((opt, index) => {
    const btn = document.createElement('button');
    btn.className = 'btn-option';
    btn.textContent = `${String.fromCharCode(65 + index)}. ${opt}`;
    btn.onclick = () => selectOption(index);
    optionsContainer.appendChild(btn);
  });

  document.getElementById('explanationBox').style.display = 'none';
  document.getElementById('nextBtn').style.display = 'none';
  startQuizTimer();
}

function startQuizTimer() {
  clearInterval(quizTimerInterval);
  timeLeft = 60;
  document.getElementById('quizTimer').textContent = `${timeLeft}s`;
  
  quizTimerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById('quizTimer').textContent = `${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(quizTimerInterval);
      selectOption(-1); // Auto-fail on timeout
    }
  }, 1000);
}

function selectOption(index) {
  clearInterval(quizTimerInterval);
  const question = currentQuizData[currentQuestionIndex];
  const options = document.querySelectorAll('.btn-option');
   
  // Disable all buttons
  options.forEach(btn => btn.disabled = true);

  if (index === question.correct) {
    quizScore++;
    options[index].classList.add('correct');
    document.getElementById('feedbackTitle').textContent = "✅ Correct!";
    document.getElementById('feedbackTitle').style.color = "var(--success)";
  } else {
    if (index !== -1) options[index].classList.add('wrong');
    options[question.correct].classList.add('correct'); 
    document.getElementById('feedbackTitle').textContent = "❌ Incorrect";
    document.getElementById('feedbackTitle').style.color = "var(--danger)";
  }

  document.getElementById('explanationText').textContent = question.exp;
  document.getElementById('explanationBox').style.display = 'block';
  document.getElementById('nextBtn').style.display = 'block';
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < currentQuizData.length) {
    loadQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  showPage('quizResultPage');
  document.getElementById('finalScore').textContent = quizScore;
  document.getElementById('totalQuestions').textContent = currentQuizData.length;
  
  const percent = Math.round((quizScore / currentQuizData.length) * 100);
  if (percent >= 75) {
    document.getElementById('resultIcon').textContent = "🏆";
    document.getElementById('resultTitle').textContent = "Passed!";
    document.getElementById('resultFeedback').textContent = "Excellent performance! You are ready for the board exam! 🎉";
  } else {
    document.getElementById('resultIcon').textContent = "💪";
    document.getElementById('resultTitle').textContent = "Failed!";
    document.getElementById('resultFeedback').textContent = "Don't give up! More practice will help you improve and achieve mastery.";
  }
}

function restartQuiz() {
  takeQuiz(activeQuizTopic);
}

function confirmExitQuiz() {
  if (confirm("Exit quiz? Progress will be lost.")) {
    showPage(currentDashboard || 'courseSelectionPage');
  }
}

// Settings
function openSettings() {
  navigationHistory.push(currentPage);
  if (currentUser) {
    document.getElementById('displayName').value = currentUser.name;
    document.getElementById('displayEmail').value = currentUser.email;
    document.getElementById('displayMajor').value = currentUser.major;
  }
  showPage('accountSettingsPage');
}

// Change password stub
function changePassword() {
  showToast('🔐 Coming soon', 'info');
}

// Logout
async function logout() {
  try {
    await signOut(auth);
    showToast('👋 See you!', 'success');
  } catch (error) {
    showToast('❌ Logout failed', 'error');
  }
}

// Toast
function showToast(msg, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = `toast active toast-${type}`;
  setTimeout(() => toast.classList.remove('active'), 3000);
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  showPage('landingPage');
  
  console.log('✅ App ready - open F12 Console for debug');
});
