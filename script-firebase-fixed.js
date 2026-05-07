// Firebase + UI - FIXED version (no module blocking)
let currentPage = 'landingPage';
let currentUser = null;
let currentDashboard = null;
window.allFreeMode = false; // Global flag for free access mode
let navigationHistory = ['landingPage'];

// Quiz Engine State
let currentQuizData = [];
let currentQuestionIndex = 0;
let quizScore = 0;
let quizTimerInterval;
let timeLeft = 60;
let activeQuizTopic = "";

// Comprehensive Question Pool for Subjects
const quizzes = {
  "The Teaching Profession": [
    { q: "Which of the following is NOT in the norms of conduct under RA 6713?", options: ["Professionalism", "Commitment to the public interest", "Justness and sincerity", "Responsiveness to the private"], correct: 3, exp: "RA 6713 specifies responsiveness to the PUBLIC, not private interests." },
    { q: "Mr. Santos is a holder of a valid certificate of eligibility as a teacher... while Mr. Cruz is a registered professional. Who is allowed to practice?", options: ["Mr. Santos only", "Both of them", "Neither of the two", "Mr. Cruz only"], correct: 1, exp: "Both credentials are legally recognized for practicing the teaching profession." },
    { q: "Is membership in the accredited professional organization for teachers mandatory for all LET passers?", options: ["Yes, when teaching", "No", "Only for first-timers", "Yes"], correct: 1, exp: "Current regulations often clarify the distinction between passing the board and mandatory active membership requirements." },
    { q: "Teacher Rochelle affirms that being a teacher is a task entrusted by this world. She believes teaching is a _______?", options: ["Profession", "Mission", "Bread butter", "Vocation"], correct: 1, exp: "A 'task entrusted' defines teaching as a Mission." },
    { q: "Teacher S has been accused of sexual harassment by a student. What should the school principal do?", options: ["Suspend immediately", "Ask to surrender", "Create a committee to investigate", "Advise transfer"], correct: 2, exp: "Due process requires a formal investigation through a committee." },
    { q: "To ensure high standards of teachers’ development, which measure must be implemented?", options: ["I and III", "II only", "II and III", "I only"], correct: 2, exp: "Personal development plans (II) and monitoring (III) are essential for quality standards." },
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
    { q: "Who was the 'Brain of the Katipunan'?", options: ["Emilio Jacinto", "Apolinario Mabini", "Andres Bonifacio", "Jose Rizal"], correct: 0, exp: "Emilio Jacinto wrote the Kartilya ng Katipunan and served as its advisor." },
    { q: "What was the name of the first Philippine republic?", options: ["Malolos Republic", "Biak-na-Bato Republic", "Commonwealth", "Third Republic"], correct: 0, exp: "The Malolos Republic was inaugurated in 1899 with Emilio Aguinaldo as president." }
  ],
  "Ethics": [
    { q: "Which theory focuses on the character of the person rather than specific actions?", options: ["Virtue Ethics", "Deontology", "Utilitarianism", "Relativism"], correct: 0, exp: "Virtue Ethics (Aristotle) focuses on the development of virtuous character traits." },
    { q: "What is the study of the origin and meaning of ethical concepts?", options: ["Meta-ethics", "Normative Ethics", "Applied Ethics", "Descriptive Ethics"], correct: 0, exp: "Meta-ethics explores the foundations and meanings of moral values." }
  ],
  "Facilitating Learning": [
    { q: "According to Piaget, in which stage do children begin to think logically about concrete events?", options: ["Sensorimotor", "Preoperational", "Concrete Operational", "Formal Operational"], correct: 2, exp: "This stage typically occurs between the ages of 7 and 11." }
  ],
  "Child & Adolescent Learners": [
    { q: "What is the adolescent crisis according to Erik Erikson's stages of development?", options: ["Identity vs. Role Confusion", "Trust vs. Mistrust", "Integrity vs. Despair", "Intimacy vs. Isolation"], correct: 0, exp: "Adolescents seek to find their own identity during this stage." }
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
    { q: "Alin sa mga sumusunod ang tumutukoy sa komunikasyong nagaganap gamit ang teknolohiya tulad ng computer o smartphone?", options: ["Intrapersonal", "Computer-Mediated Communication (CMC)", "Harapang Komunikasyon", "Komunikasyon sa Maliit na Pangkat"], correct: 1, exp: "Ang CMC ay tumutukoy sa anumang komunikasyon ng tao na nagaganap gamit ang mga elektronikong aparato." },
    { q: "Ano ang tawag sa pag-aaral ng oras sa komunikasyon, tulad ng pagiging huli sa isang appointment?", options: ["Proxemics", "Haptics", "Chronemics", "Kinesics"], correct: 2, exp: "Ang Chronemics ay ang pag-aaral ng oras sa komunikasyon, kabilang ang pagiging maagap." },
    { q: "Aling barayti ng wika ang ginagamit sa isang partikular na rehiyon o lalawigan?", options: ["Sosyolek", "Idyolek", "Dayalekto", "Register"], correct: 2, exp: "Ang Dayalekto ay isang rehiyonal na barayti ng wika na naiiba sa bokabularyo o gramatika." },
    { q: "Ano ang tawag sa \"lingua franca\" o pambansang wika ng mga Pilipino?", options: ["Tagalog", "Cebuano", "Filipino", "Ingles"], correct: 2, exp: "Ayon sa 1987 Konstitusyon, ang Filipino ang pambansang wika ng Pilipinas." },
    { q: "Sa komunikasyon, ano ang tawag sa literal na kahulugan ng salita na matatagpuan sa diksyunaryo?", options: ["Konotasyon", "Denotasyon", "Pragmatiks", "Semantika"], correct: 1, exp: "Ang Denotasyon ay ang literal o direktang kahulugan ng salita mula sa diksyunaryo." },
    { q: "Anong uri ng komunikasyon ang naglalayong magbigay ng impormasyon sa malawak na madla sa pamamagitan ng media gaya ng telebisyon?", options: ["Interpersonal", "Mass Communication", "Intrapersonal", "Organisasyonal"], correct: 1, exp: "Ang Mass Communication ay ang pagpaparating ng impormasyon sa malawak na madla." },
    { q: "Alin sa mga sumusunod ang halimbawa ng pormal na komunikasyon?", options: ["Tsismisan sa kanto", "Pagtetext sa kaibigan", "Pagbibigay ng ulat sa pulong (Meeting)", "Pakikipag-usap sa palengke"], correct: 2, exp: "Ang pormal na komunikasyon ay sumusunod sa mga itinatag na istruktura at pamantayan." },
    { q: "Ano ang tawag sa sagabal na may kinalaman sa emosyon o mental na estado ng tao, tulad ng pagkapagod o stress?", options: ["Pisyolohikal", "Sikolohikal", "Pisikal", "Semantiko"], correct: 1, exp: "Ang sikolohikal na ingay ay tumutukoy sa mga mental o emosyonal na salik na nakakasagabal." },
    { q: "Aling tungkulin ng wika ang ginagamit sa pagkuha o paghahanap ng impormasyon, gaya ng pagtatanong o pananaliksik?", options: ["Heuristiko", "Representasyonal", "Instrumental", "Personal"], correct: 0, exp: "Ang heuristikong tungkulin ng wika ay ginagamit sa pagkuha o paghahanap ng impormasyon." },
    { q: "Ano ang tawag sa kasanayang pangwika na tumutukoy sa pagsasalin ng iniisip o nadarama sa pamamagitan ng mga simbolo sa papel o digital platform?", options: ["Pakikinig", "Pagsasalita", "Pagbabasa", "Pagsusulat"], correct: 3, exp: "Ang pagsusulat ay ang paglilipat ng mga iniisip sa mga simbolo sa papel o digital." },
    { q: "Alin sa mga sumusunod ang nagpapakita ng \"Interkultural na Komunikasyon\"?", options: ["Pag-uusap ng dalawang magkapatid.", "Pakikipagnegosasyon ng isang Pilipino sa isang Hapones.", "Pagbabasa ng sariling talaarawan (diary).", "Panonood ng balita sa lokal na channel."], correct: 1, exp: "Ang Interkultural na Komunikasyon ay nagaganap sa pagitan ng magkaibang kultura." },
    { q: "Ano ang ibig sabihin ng \"Register\" ng wika?", options: ["Listahan ng mga bagong salita sa diksyunaryo.", "Pag-aangkop ng wika base sa propesyon o paksang pinag-uusapan.", "Paglilista ng mga pangalan ng estudyante.", "Wikang ginagamit lamang sa bahay."], correct: 1, exp: "Ang Register ay barayti ng wika na iniaangkop sa propesyon o paksa." },
    { q: "Anong aspeto ng di-berbal na komunikasyon ang tumutukoy sa tono, bilis, at lakas ng boses?", options: ["Kinesics", "Paralanguage (Vocalics)", "Proxemics", "Chronemics"], correct: 1, exp: "Ang Paralanguage ay tumutukoy sa tono, bilis, at lakas ng boses sa pagsasalita." },
    { q: "Aling bahagi ng modelong komunikasyon ang nagsisilbing daanan ng mensahe, tulad ng hangin o kable ng telepono?", options: ["Tagahatid", "Mensahe", "Tsanel (Channel)", "Feedback"], correct: 2, exp: "Ang Tsanel ang nagsisilbing daluyan ng mensahe mula sa tagahatid." },
    { q: "Ano ang tawag sa komunikasyong nagaganap sa loob ng isang kumpanya o ahensya?", options: ["Interkultural", "Organisasyonal", "Pangmadla", "Intrapersonal"], correct: 1, exp: "Ang Organisasyonal na Komunikasyon ay ang daloy ng impormasyon sa loob ng isang kumpanya." },
    { q: "Alin ang katangian ng \"Kakayahang Istratedyik\"?", options: ["Pagkabisado ng buong diksyunaryo.", "Paggamit ng senyas o ibang paraan upang hindi maputol ang komunikasyon kapag may problema sa wika.", "Pagsulat ng tula na may tugma.", "Pag-unawa sa kasaysayan ng wika."], correct: 1, exp: "Ang Kakayahang Istratedyik ay ang paggamit ng mga paraan upang mapanatili ang komunikasyon." },
    { q: "Ano ang tawag sa masining na pagpapahayag na hindi direkta ang kahulugan, gaya ng mga idyoma?", options: ["Denotasyon", "Matayutay na pahayag", "Teknikal na pagsulat", "Direkta na komunikasyon"], correct: 1, exp: "Ang matayutay na pahayag ay gumagamit ng mga salitang hindi direkta ang kahulugan." },
    { q: "Anong uri ng pakikinig ang layunin ay magbigay ng payo o makiramay sa nagsasalita?", options: ["Kritikal na Pakikinig", "Empatikong Pakikinig", "Deskriminatibong Pakikinig", "Pasibong Pakikinig"], correct: 1, exp: "Ang empatikong pakikinig ay naglalayong magbigay ng suporta sa damdamin ng iba." },
    { q: "Ano ang tawag sa barayti ng wika na walang pormal na istraktura at nabubuo dahil sa pangangailangan ng dalawang taong may magkaibang wika?", options: ["Creole", "Pidgin", "Sosyolek", "Etnolek"], correct: 1, exp: "Ang Pidgin ay isang pansamantalang wika na nabubuo para sa komunikasyon." },
    { q: "Kapag ang isang Pidgin ay naging likas na wika na ng isang komunidad, ano ang tawag dito?", options: ["Dayalekto", "Idyolek", "Creole", "Sosyolek"], correct: 2, exp: "Ang Creole ay isang Pidgin na naging unang wika na ng isang komunidad." },
    { q: "Ano ang tawag sa komunikasyong gumagamit ng mga larawan o simbolo gaya ng traffic signs?", options: ["Iconics", "Vocalics", "Haptics", "Chronemics"], correct: 0, exp: "Ang Iconics ay ang paggamit ng mga larawan o simbolo upang maghatid ng mensahe." },
    { q: "Aling uri ng pagsulat ang naglalayong magbigay ng ulat, instruksyon, o paliwanag sa isang propesyonal na larangan?", options: ["Malikhaing Pagsulat", "Teknikal na Pagsulat", "Dyornalistik na Pagsulat", "Reperensyal na Pagsulat"], correct: 1, exp: "Ang Teknikal na Pagsulat ay ginagamit upang magbigay ng impormasyon o instruksyon." },
    { q: "Sa etika ng komunikasyon, ano ang tinutukoy ng \"Integridad\"?", options: ["Paggamit ng mamahaling kagamitan sa pag-uulat.", "Pagiging matapat at pagkakaroon ng matibay na moral na prinsipyo sa paghahatid ng impormasyon.", "Pagkakaroon ng maraming followers sa social media.", "Pagsasalita sa wikang Ingles lamang."], correct: 1, exp: "Ang integridad sa komunikasyon ay ang pagiging matapat at pagkakaroon ng prinsipyo." },
    { q: "Alin sa mga sumusunod ang halimbawa ng \"Sikolohikal na Ingay\"?", options: ["Malakas na busina ng sasakyan.", "Maling baybay ng salita.", "Pag-iisip ng problema habang may nakikipag-usap.", "Sirang mikropono."], correct: 2, exp: "Ang sikolohikal na ingay ay internal na abala tulad ng pag-iisip ng problema." },
    { q: "Ano ang tawag sa kakayahang pagsama-samahin ang mga pangungusap upang makabuo ng isang lohikal na teksto?", options: ["Kakayahang Lingguwistiko", "Kakayahang Sosyolingguwistiko", "Kakayahang Diskorsal", "Kakayahang Istratedyik"], correct: 2, exp: "Ang Kakayahang Diskorsal ay ang pagsama-samahin ang mga pangungusap para sa lohikal na teksto." },
    { q: "Ang pag-aaral ng galaw ng mata bilang komunikasyon ay tinatawag na:", options: ["Oculesics", "Olfactics", "Gustics", "Haptics"], correct: 0, exp: "Ang Oculesics ay ang pag-aaral ng galaw ng mata at eye contact sa komunikasyon." },
    { q: "Aling tungkulin ng wika ang ginagamit sa paglikha ng mga kwento, tula, at iba pang masining na akda?", options: ["Heuristiko", "Imahinatibo", "Interaksyonal", "Regulatori"], correct: 1, exp: "Ang imahinatibong tungkulin ng wika ay ginagamit sa paglikha ng mga masining na akda." },
    { q: "Ano ang tawag sa barayti ng wika na ginagamit ng mga etnolinggwistikong grupo?", options: ["Sosyolek", "Idyolek", "Etnolek", "Register"], correct: 2, exp: "Ang Etnolek ay barayti ng wika na likas sa isang pangkat-etniko." },
    { q: "Alin sa mga sumusunod ang \"Pisyolohikal na Sagabal\"?", options: ["Maingay na construction site.", "Pagkakaroon ng kapansanan sa pandinig (hearing impairment).", "Hindi pagkakaunawaan sa kultura.", "Maling gamit ng bantas."], correct: 1, exp: "Ang pisyolohikal na sagabal ay mga biyolohikal na kondisyon tulad ng kapansanan sa pandinig." },
    { q: "Ano ang tawag sa proseso ng pag-unawa at pagbibigay-interpretasyon sa mga nabasang simbolo?", options: ["Pagsulat", "Pagbabasa", "Pakikinig", "Pagsasalita"], correct: 1, exp: "Ang pagbabasa ay ang kognitibong proseso ng pag-unawa sa mga nakasulat na simbolo." },
    { q: "Aling uri ng komunikasyon ang karaniwang ginagamitan ng mga \"mass media channels\"?", options: ["Intrapersonal", "Interpersonal", "Public Communication", "Mass Communication"], correct: 3, exp: "Ang Mass Communication ay gumagamit ng media upang maabot ang malawak na madla." },
    { q: "Ano ang pangunahing layunin ng \"Perswadibong Komunikasyon\"?", options: ["Mang-aliw", "Magbigay ng impormasyon", "Manghikayat o magpabago ng paniniwala ng iba", "Magpahayag ng galit"], correct: 2, exp: "Ang perswadibong komunikasyon ay naglalayong manghikayat o magpabago ng paniniwala." },
    { q: "Ang paggamit ng \"Bekimon\" o \"Jargon\" ay halimbawa ng anong barayti ng wika?", options: ["Dayalekto", "Sosyolek", "Idyolek", "Etnolek"], correct: 1, exp: "Ang Sosyolek ay barayti ng wika na batay sa pangkat na kinabibilangan sa lipunan." },
    { q: "Aling elemento ng komunikasyon ang tumutukoy sa lugar, oras, at sitwasyon kung saan nagaganap ang pag-uusap?", options: ["Mensahe", "Tsanel", "Konteksto", "Feedback"], correct: 2, exp: "Ang konteksto ay tumutukoy sa sitwasyon, lugar, at oras kung saan nagaganap ang usapan." },
    { q: "Bakit mahalaga ang \"Malayuning Komunikasyon\"?", options: ["Upang makapanloko ng kapwa.", "Upang maging epektibo at etikal ang paghahatid ng mensahe sa iba't ibang sitwasyon.", "Upang magpakitang-gilas sa pagsasalita.", "Upang makaiwas sa pakikipag-usap sa iba."], correct: 1, exp: "Ang Malayuning Komunikasyon ay mahalaga para sa epektibo at etikal na pakikipagtalastasan." }
  ]
  ,
  "Filipino Majorship": [
    { q: "Ano ang tawag sa makaagham na pag-aaral ng mga makabuluhang tunog ng isang wika?", options: ["Morpolohiya", "Ponolohiya", "Sintaksis", "Semantika"], correct: 1, exp: "Ang ponolohiya ay ang pag-aaral ng mga tunog o ponema ng wika." },
    { q: "Sa salitang 'magdinuguan', ang salitang-ugat ay 'dugo'. Ano ang tawag sa pagbabagong morpoponemiko kung saan ang /o/ ay naging /u/?", options: ["Asimilasyon", "Metatesis", "Pagpapalit ng Ponema", "Paglilipat-diwa"], correct: 2, exp: "Nagaganap ang pagpapalit ng ponema kapag ang isang titik ay napapalitan ng iba (o -> u)." },
    { q: "Alin sa mga sumusunod ang isang halimbawa ng klaster o kambal-katinig?", options: ["Bahay", "Aliw", "Prutas", "Kamay"], correct: 2, exp: "Ang 'pr' sa prutas ay halimbawa ng klaster dahil may dalawang katinig sa isang pantig." },
    { q: "Sino ang may-akda ng 'Doctrina Christiana', ang kauna-unahang aklat na nalimbag sa Pilipinas noong 1593?", options: ["Jose Rizal", "Padre Juan de Placencia", "Lope K. Santos", "Graciano Lopez Jaena"], correct: 1, exp: "Si Padre Juan de Placencia ang sumulat ng unang aklat sa Pilipinas." },
    { q: "Ang 'Urbana at Feliza' ay isang akdang naglalaman ng palitan ng liham ng dalawang magkapatid tungkol sa mabuting asal. Sino ang sumulat nito?", options: ["Modesto de Castro", "Jose dela Cruz", "Pascual Poblete", "Valeriano Hernandez-Peña"], correct: 0, exp: "Si Padre Modesto de Castro ang tinaguriang 'Ama ng Tuluyang Klasika sa Tagalog'." },
    { q: "Ano ang tawag sa mga salitang naglalarawan sa pangngalan o panghalip?", options: ["Pandiwa", "Pang-uri", "Pang-abay", "Pangatnig"], correct: 1, exp: "Ang pang-uri ay nagbibigay-turing sa pangngalan o panghalip." },
    { q: "'Ang mamatay nang dahil sa iyo.' Ano ang pokus ng pandiwang 'mamatay' sa linyang ito mula sa Lupang Hinirang?", options: ["Pokus sa Tagaganap", "Pokus sa Layon", "Pokus sa Sanhi", "Pokus sa Ganapan"], correct: 2, exp: "Pokus sa sanhi dahil ang paksa ang siyang dahilan o sanhi ng kilos." },
    { q: "Aling uri ng tula ang walang sukat at walang tugma ngunit may aliw-iw?", options: ["Tradisyunal na tula", "Malayang taludturan", "Soneto", "Haiku"], correct: 1, exp: "Ang malayang taludturan (free verse) ay walang sinusunod na sukat o tugma." },
    { q: "Sino ang tinaguriang 'Huseng Sisiw' na naging guro ni Francisco Balagtas sa pagsulat ng tula?", options: ["Jose dela Cruz", "Jose Corazon de Jesus", "Amado V. Hernandez", "Severino Reyes"], correct: 0, exp: "Si Jose dela Cruz ang tinaguriang Huseng Sisiw." },
    { q: "Sa pagsusuring pampanitikan, anong teorya ang nakatuon sa pakikibaka ng mga manggagawa at mahihirap laban sa mga mayayaman?", options: ["Humanismo", "Markismo", "Feminismo", "Eksistensyalismo"], correct: 1, exp: "Ang Markismo ay tumatalakay sa tunggalian ng mga uri sa lipunan." },
    { q: "Alin ang tamang gamit ng 'ng' at 'nang'?", options: ["Tumakbo siya ng mabilis.", "Kumain siya nang marami.", "Ang anak nang presidente.", "Matulog ka na ng mahimbing."], correct: 1, exp: "Ginagamit ang 'nang' bilang pangatnig sa mga pang-abay na pamaraan." },
    { q: "Ano ang kahulugan ng idyomang 'nagbibilang ng poste'?", options: ["Masipag magtrabaho", "Walang trabaho", "Inhinyero sa kalsada", "Mapagmatas"], correct: 1, exp: "Ito ay idyoma para sa taong walang hanapbuhay." },
    { q: "Sa metodolohiya ng pagtuturo, ano ang tawag sa paraan kung saan nagsisimula ang talakayan sa mga halimbawa patungo sa pagbuo ng tuntunin?", options: ["Induktibo", "Deduktibo", "Integrated", "Discovery"], correct: 0, exp: "Ang pamaraang induktibo ay mula sa partikular patungong panlahat." },
    { q: "Alin sa mga sumusunod ang itinuturing na 'Gintong Panahon' ng Panitikang Pilipino?", options: ["Panahon ng Kastila", "Panahon ng Amerikano", "Panahon ng Hapon", "Panahon ng Bagong Lipunan"], correct: 2, exp: "Tinawag itong Gintong Panahon dahil masiglang namayagpag ang wikang Tagalog." },
    { q: "Sino ang sumulat ng tulang 'Ako ang Daigdig' na nagpakilala ng malayang taludturan sa Pilipinas?", options: ["Alejandro G. Abadilla", "Virgilio Almario", "Teodoro Agoncillo", "Bienvenido Lumbera"], correct: 0, exp: "Si AGA ang nagdala ng modernismo sa panulaang Tagalog." },
    { q: "Ano ang tawag sa yunit ng wika na nabubuo mula sa pagsasama-sama ng mga morpema?", options: ["Sugnay", "Parirala", "Salita", "Diskurso"], correct: 2, exp: "Ang salita ang nabubuo mula sa pinakamaliit na yunit ng kahulugan (morpema)." },
    { q: "Alin sa mga sumusunod ang isang anyo ng dula na may kantahan at sayawan, at karaniwang tumatalakay sa pag-ibig at suliraning panlipunan?", options: ["Senakulo", "Sarsuwela", "Tibag", "Panunuluyan"], correct: 1, exp: "Ang sarsuwela ay isang komedya o melodramang may kasamang awit at tugtog." },
    { q: "Sino ang sumulat ng 'Nena at Neneng', na itinuturing na isa sa mga unang nobelang Tagalog?", options: ["Lope K. Santos", "Valeriano Hernandez-Peña", "Faustino Aguilar", "Inigo Ed Regalado"], correct: 1, exp: "Si Valeriano Hernandez-Peña ang sumulat ng Nena at Neneng." },
    { q: "Ano ang tawag sa pag-aaral ng relasyon ng wika at ng lipunan?", options: ["Antropolohiya", "Sosyolingguwistika", "Psycholinguistics", "Philology"], correct: 1, exp: "Ang sosyolingguwistika ay ang pag-aaral ng epekto ng lipunan sa wika." },
    { q: "Alin sa mga sumusunod ang wastong gamit ng salitang 'may' at 'mayroon'?", options: ["Mayroon siyang dalang pagkain.", "May tao sa loob ng bahay.", "May pera ka ba?", "Lahat ng nabanggit ay tama."], correct: 3, exp: "Ang lahat ng pangungusap ay sumusunod sa wastong balarila." },
    { q: "Ano ang tawag sa bantas na ginagamit sa paghihiwalay ng mga salitang inuulit (hal. araw-araw)?", options: ["Kudlit", "Gitling", "Tutuldok", "Kuwit"], correct: 1, exp: "Ginagamit ang gitling (-) sa mga salitang inuulit." },
    { q: "Sino ang Ama ng Maikling Kuwentong Tagalog?", options: ["Deogracias A. Rosario", "Efren Abueg", "Genoveva Edroza-Matute", "Narciso Reyes"], correct: 0, exp: "Si Deogracias A. Rosario ang kinikilalang ama nito." },
    { q: "Ang 'Lupang Hinirang' ay unang tinugtog sa anong instrumento noong idineklara ang kalayaan sa Kawit, Cavite?", options: ["Gitara", "Piyano", "Banda (mga instrumentong hinihipan)", "Biyolin"], correct: 2, exp: "Ang Banda ng San Francisco de Malabon ang unang tumugtog nito." },
    { q: "Anong uri ng tayutay ang gumagamit ng mga salitang 'parang', 'gaya ng', at 'katulad ng'?", options: ["Pagwawangis (Metaphor)", "Pagtutulad (Simile)", "Pagbibigay-katauhan (Personification)", "Pagmamalabis (Hyperbole)"], correct: 1, exp: "Ang pagtutulad o simile ay direktang paghahambing." },
    { q: "Alin sa mga sumusunod ang layunin ng K-12 kurikulum sa asignaturang Filipino?", options: ["Mapalalim ang kaalaman sa kasaysayan ng ibang bansa.", "Malinang ang kakayahang komunikatibo, replektibo, at mapanuring pag-iisip.", "Mapabilis ang pag-aaral ng wikang Ingles.", "Makabisado ang lahat ng salita sa diksyunaryo."], correct: 1, exp: "Pangunahing mithiin nito ang literasing pangwika." },
    { q: "Anong bahagi ng pananalita ang nag-uugnay sa dalawang salita, parirala, o sugnay, gaya ng 'at', 'pati', at 'dahil sa'?", options: ["Pang-ukol", "Pang-angkop", "Pangatnig", "Pananda"], correct: 2, exp: "Ang pangatnig (conjunction) ay ginagamit sa pagpapatanda ng ugnayan ng mga yunit ng pangungusap." },
    { q: "Sa pangungusap na 'Ipinampunas niya ng sapatos ang lumang basahan,' ano ang pokus ng pandiwa?", options: ["Pokus sa Layon", "Pokus sa Tagaganap", "Pokus sa Gamit (Instrumental)", "Pokus sa Direksyunal"], correct: 2, exp: "Pokus sa gamit dahil ang paksa (lumang basahan) ang siyang ginamit upang isagawa ang kilos ng pandiwa." },
    { q: "Sino ang tinaguriang 'Ama ng Balarilang Tagalog' na sumulat ng 'Balarila ng Wikang Pambansa'?", options: ["Lope K. Santos", "Julian Felipe", "Manuel L. Quezon", "Jose Villa Panganiban"], correct: 0, exp: "Si Lope K. Santos ang kinikilalang ama ng balarila at siya ring bumuo ng Abakada." },
    { q: "Anong teorya ng pampanitikan ang naniniwalang ang babae ay may sariling kakayahan at hindi lamang pantulong sa lalaki?", options: ["Markismo", "Feminismo", "Humanismo", "Realismo"], correct: 1, exp: "Ang feminismo ay naglalayong itampok ang lakas, talino, at papel ng mga kababaihan sa lipunan at panitikan." },
    { q: "Alin sa mga sumusunod ang halimbawa ng dipthonggo?", options: ["Klase", "Bahay", "Plano", "Blusa"], correct: 1, exp: "Ang dipthonggo ay ang pagsasama ng patinig at ng malapatinig na w at y sa loob ng isang pantig (hal. -ay)." },
    { q: "Anong uri ng panitikan ang 'Florante at Laura'?", options: ["Korido", "Awit", "Elehiya", "Oda"], correct: 1, exp: "Ang 'Florante at Laura' ay isang awit dahil ito ay may 12 pantig bawat taludtod at binibigkas nang mabagal." },
    { q: "Ano ang tawag sa pinakamaliit na yunit ng tunog na nagpapabago sa kahulugan ng isang salita?", options: ["Morpema", "Ponema", "Alomorp", "Sintaks"], correct: 1, exp: "Ang ponema ang pundasyon ng tunog sa wika; ang pagbabago nito ay nagbabago sa kahulugan ng salita." },
    { q: "Ano ang kahulugan ng idyomang 'itaga sa bato'?", options: ["Maging malakas", "Magtago ng lihim", "Tandaan o pakatandaan", "Makipag-away"], correct: 2, exp: "Ginagamit ito kapag ang isang tao ay nangangako na ang isang bagay ay hindi niya malilimutan." },
    { q: "Sino ang sumulat ng nobelang 'Banaag at Sikat' na itinuturing na Bibliya ng mga manggagawang Pilipino?", options: ["Lope K. Santos", "Amado V. Hernandez", "Lazaro Francisco", "Faustino Aguilar"], correct: 0, exp: "Tinatalakay ng nobelang ito ang mga kaisipang sosyalismo at karapatan ng mga manggagawa." },
    { q: "Anong uri ng pagbabagong morpoponemiko ang naganap sa salitang 'niluto' mula sa 'linuto'?", options: ["Pagkaltas ng Ponema", "Metatesis", "Pagpapalit ng Ponema", "Asimilasyon"], correct: 1, exp: "Nagakaroon ng metatesis kapag nagpapalit ng posisyon ang mga titik (l at n) sa loob ng salita." },
    { q: "Alin sa mga sumusunod ang itinuturing na pinakamatandang sistema ng pagsulat ng mga Pilipino bago dumating ang mga Kastila?", options: ["Alibata", "Baybayin", "Abakada", "Alpabetong Romano"], correct: 1, exp: "Baybayin ang wastong tawag sa sinaunang paraan ng pagsulat na binubuo ng 17 titik." },
    { q: "Anong bantas ang ginagamit upang ipakita ang pagkakasunod-sunod ng mga oras?", options: ["Tutuldok-kuwit", "Tutuldok (Colon)", "Kudlit", "Gitling"], correct: 1, exp: "Ginagamit ang tutuldok sa pagsulat ng oras (hal. 8:30 PM)." },
    { q: "Sino ang tinaguriang 'Makata ng mga Manggagawa'?", options: ["Jose Corazon de Jesus", "Amado V. Hernandez", "Francisco Balagtas", "Alejandro Abadilla"], correct: 1, exp: "Kilala si Amado V. Hernandez sa kanyang mga akdang tumatalakay sa kalagayan ng mga obrero." },
    { q: "Ano ang tawag sa antas ng wika na ginagamit sa mga seryosong publikasyon at sa paaralan?", options: ["Balbal", "Kolokyal", "Lalawiganin", "Pormal"], correct: 3, exp: "Ang pormal na wika ay kinikilala ng nakararami at ginagamit sa mga pormal na okasyon." },
    { q: "Alin ang tamang baybay ayon sa makabagong alpabetong Filipino?", options: ["Relehiyion", "Relihyon", "Relihiyon", "Relihion"], correct: 2, exp: "Ang tamang baybay ay sumusunod sa tuntunin ng ortograpiya ng wikang pambansa." },
    { q: "Ano ang tawag sa pag-aaral ng kahulugan ng mga salita at pangungusap?", options: ["Morpolohiya", "Ponolohiya", "Semantika", "Pragmatika"], correct: 2, exp: "Ang semantika ay nakatuon sa interpretasyon at relasyon ng mga kahulugan sa wika." },
    { q: "Sino ang paring Kastila na sumulat ng 'Barlaan at Josaphat,' ang unang nobelang nalimbag sa Pilipinas?", options: ["Padre Juan de Placencia", "Padre Antonio de Borja", "Padre Modesto de Castro", "Padre Jose Burgos"], correct: 1, exp: "Isinalin ni Antonio de Borja ang akdang ito na itinuturing na unang nobela sa Tagalog." },
    { q: "Anong uri ng tayutay ang 'Ang mga bituin sa langit ay kumukurap sa atin'?", options: ["Pagtutulad", "Pagwawangis", "Pagbibigay-katauhan", "Pagtawag"], correct: 2, exp: "Binibigyan ng katangiang pantao (kumukurap) ang isang walang buhay na bagay (bituin)." },
    { q: "Sa pagtuturo ng wika, ano ang tawag sa paggamit ng dalawang wika bilang midyum ng instruksyon?", options: ["Monolingguwalismo", "Bilingguwalismo", "Multilingguwalismo", "Diglossia"], correct: 1, exp: "Ang patakarang bilingguwal ay ang paggamit ng Filipino at Ingles sa pagtuturo." },
    { q: "Ano ang tawag sa mga salitang nagpapahayag ng kilos o galaw?", options: ["Pangngalan", "Pandiwa", "Pang-abay", "Pang-ugnay"], correct: 1, exp: "Ang pandiwa (verb) ang nagsasaad ng aksyon o estado ng paksa." },
    { q: "Sino ang may-akda ng maikling kuwentong 'Lupang Tinubuan' na nagwagi ng unang gantimpala noong panahon ng Hapon?", options: ["Deogracias Rosario", "Narciso Reyes", "Liwayway Arceo", "Macario Pineda"], correct: 1, exp: "Ang akda ni Narciso Reyes ay tanyag na kuwento noong 'Gintong Panahon' ng Tagalog." },
    { q: "Ano ang tawag sa paglilipat ng kahulugan ng isang teksto mula sa isang wika patungo sa ibang wika?", options: ["Pagbasa", "Pakikinig", "Pagsasaling-wika", "Pagbuo ng Diskurso"], correct: 2, exp: "Layunin nito na mapanatili ang diwa ng orihinal na teksto sa target na wika." },
    { q: "Anong uri ng tula ang binubuo ng labing-apat na taludtod?", options: ["Haiku", "Tanaga", "Soneto", "Elehiya"], correct: 2, exp: "Ang soneto (sonnet) ay may tiyak na estruktura na labing-apat na linya." },
    { q: "Alin sa mga sumusunod ang bahagi ng pahayagan na naglalaman ng kuro-kuro ng patnugot?", options: ["Balitang Panlalawigan", "Klasipikadong Anunsyo", "Editoryal", "Isports"], correct: 2, exp: "Ang editoryal ang tinig ng pahayagan tungkol sa isang napapanahong isyu." },
    { q: "Sino ang kinikilalang 'Makata ng Pag-ibig' at may sagisag na 'Batute'?", options: ["Jose Corazon de Jesus", "Francisco Balagtas", "Florentino Collantes", "Emilio Jacinto"], correct: 0, exp: "Siya ang tinaguriang 'Hari ng Balagtasan' at tanyag sa kanyang mga tulang liriko." },
    { q: "Ano ang tawag sa pag-aaral ng wastong baybay ng mga salita?", options: ["Ponolohiya", "Ortograpiya", "Paleograpiya", "Etimolohiya"], correct: 1, exp: "Ang ortograpiya ay ang set ng mga tuntunin sa pagsulat ng wika." },
    { q: "Anong uri ng pangungusap ang 'Naku! May sunog!'?", options: ["Paturol", "Patanong", "Padamdam", "Pautos"], correct: 2, exp: "Ito ay nagpapahayag ng matinding damdamin at nagtatapos sa bantas na pandamdam (!)." },
    { q: "Sino ang sumulat ng nobelang 'Noli Me Tangere'?", options: ["Marcelo H. del Pilar", "Jose Rizal", "Andres Bonifacio", "Apolinario Mabini"], correct: 1, exp: "Isinulat ito ni Rizal upang ilantad ang kanser ng lipunang Pilipino sa ilalim ng Kastila." },
    { q: "Ano ang tawag sa barayti ng wika na nakabatay sa pinanggalingang rehiyon ng nagsasalita?", options: ["Idyolek", "Dayalekto", "Sosyolek", "Etnolek"], correct: 1, exp: "Ang dayalekto ay wikang ginagamit sa isang partikular na lugar." },
    { q: "Alin sa mga sumusunod ang wastong gamit ng 'pinto' at 'pintuan'?", options: ["Nakasara ang pintuan.", "Dumaan ka sa pintuan.", "Buksan mo ang pintuan.", "Pintuan ang inilalagay sa bisagra."], correct: 1, exp: "Ang 'pinto' ay ang mismong harang, samantalang ang 'pintuan' ay ang espasyong dinaraanan." },
    { q: "Ano ang tawag sa tulang may pitong pantig bawat taludtod at binubuo ng apat na linya na may tugmaang aaaa?", options: ["Haiku", "Tanaga", "Dalit", "Ambahan"], correct: 1, exp: "Ang tanaga ay isang katutubong anyo ng tula na maikli ngunit makahulugan." },
    { q: "Sino ang Ama ng Wikang Pambansa?", options: ["Sergio Osmeña", "Manuel L. Quezon", "Jose P. Laurel", "Ramon Magsaysay"], correct: 1, exp: "Si Manuel L. Quezon ang nagtulak na magkaroon ng isang wikang pambansa." },
    { q: "Ano ang tawag sa pag-aaral ng kasaysayan o pinagmulan ng isang salita?", options: ["Semantika", "Etimolohiya", "Antropolohiya", "Morpolohiya"], correct: 1, exp: "Tinatalakay ng etimolohiya kung paano nagbago ang anyo at kahulugan ng salita sa panahon." },
    { q: "Ano ang pokus ng pandiwa sa pangungusap na 'Nagluto ang nanay ng adobo'?", options: ["Pokus sa Tagaganap (Aktor)", "Pokus sa Layon", "Pokus sa Tagatanggap", "Pokus sa Ganapan"], correct: 0, exp: "Ang paksa ng pangungusap (nanay) ang siyang gumaganap sa kilos." },
    { q: "Sa ilalim ng MTB-MLE, ano ang pangunahing wikang gagamitin sa pagtuturo mula Kindergarten hanggang Grade 3?", options: ["Filipino", "Ingles", "Unang Wika (Mother Tongue)", "Espanyol"], correct: 2, exp: "Layunin nito na gamitin ang wika sa tahanan upang mas madaling matuto ang bata." }
  ],
  "English Majorship": [
    { q: "Which branch of linguistics studies the sound system of a language and the rules that govern sound combinations?", options: ["Morphology", "Phonology", "Syntax", "Semantics"], correct: 1, exp: "Phonology focuses on phonemes and their patterns." },
    { q: "What is the smallest unit of meaning in a language?", options: ["Phoneme", "Morpheme", "Allophone", "Grapheme"], correct: 1, exp: "A morpheme can be a word like 'dog' or an affix like '-ed'." },
    { q: "In the sentence, 'The diligent student passed the exam,' what is the function of the word 'diligent'?", options: ["Noun", "Adverb", "Adjective", "Predicate"], correct: 2, exp: "It modifies the noun 'student'." },
    { q: "Which type of sentence contains one independent clause and at least one dependent (subordinate) clause?", options: ["Simple", "Compound", "Complex", "Compound-Complex"], correct: 2, exp: "Example: 'I stayed home because it was raining.'" },
    { q: "This literary period in British Literature is known as the 'Golden Age of Drama' and features playwrights like William Shakespeare and Christopher Marlowe.", options: ["Victorian Era", "Romantic Period", "Elizabethan Period (Renaissance)", "Neoclassical Period"], correct: 2, exp: "The Elizabethan era saw the flourishing of English drama." },
    { q: "Who is the author of the masterpiece 'The Canterbury Tales,' written in Middle English?", options: ["William Shakespeare", "Geoffrey Chaucer", "John Milton", "Alexander Pope"], correct: 1, exp: "Geoffrey Chaucer is known as the Father of English Literature." },
    { q: "In American Literature, which movement emphasized intuition, nature, and the inherent goodness of people, led by Ralph Waldo Emerson and Henry David Thoreau?", options: ["Realism", "Naturalism", "Transcendentalism", "Modernism"], correct: 2, exp: "Transcendentalism was a philosophical and literary movement in the mid-19th century." },
    { q: "Which Philippine author wrote 'The Woman Who Had Two Navels' and is a National Artist for Literature?", options: ["Jose Garcia Villa", "Nick Joaquin", "F. Sionil Jose", "N.V.M. Gonzalez"], correct: 1, exp: "Nick Joaquin is a giant of Philippine literature in English." },
    { q: "What figure of speech is used in the phrase: 'The wind whispered through the trees'?", options: ["Simile", "Metaphor", "Personification", "Hyperbole"], correct: 2, exp: "Personification gives human qualities to non-human things." },
    { q: "Which language teaching approach prioritizes oral communication and repetitive drills without using the students' native language?", options: ["Grammar-Translation Method", "Audio-Lingual Method (ALM)", "Communicative Language Teaching (CLT)", "Silent Way"], correct: 1, exp: "ALM is based on behaviorist theory—habit formation through drills." },
    { q: "In Homer’s 'The Iliad,' who is the Greek hero whose 'rage' is the central theme of the epic?", options: ["Hector", "Agamemnon", "Achilles", "Odysseus"], correct: 2, exp: "The Iliad begins with the invocation of the rage of Achilles." },
    { q: "What is the term for a word that is spelled the same as another word but has a different meaning and often a different pronunciation?", options: ["Homophone", "Homograph", "Synonym", "Antonym"], correct: 1, exp: "Example: 'lead' (metal) vs. 'lead' (to guide)." },
    { q: "Which assessment tool is used to evaluate a student's performance based on a set of criteria and levels of quality?", options: ["Multiple-choice test", "Rubric", "Cloze test", "Portfolio"], correct: 1, exp: "Rubrics provide clear expectations for assignments." },
    { q: "In Afro-Asian Literature, which Indian author won the Nobel Prize for Literature for his work 'Gitanjali'?", options: ["R.K. Narayan", "Rabindranath Tagore", "Arundhati Roy", "Salman Rushdie"], correct: 1, exp: "Tagore was the first non-European to win the Nobel Prize in Literature." },
    { q: "What is the 'Great Vowel Shift'?", options: ["A change in spelling in the 20th century.", "A major change in the pronunciation of English long vowels (1400-1700).", "The adoption of French words.", "The first English dictionary."], correct: 1, exp: "It marks the transition from Middle English to Modern English." },
    { q: "Which type of irony occurs when the audience knows something that the characters in the story do not?", options: ["Verbal Irony", "Situational Irony", "Dramatic Irony", "Cosmic Irony"], correct: 2, exp: "Dramatic irony creates tension or humor for the audience." },
    { q: "'The sun is a golden ball.' This is an example of:", options: ["Simile", "Metaphor", "Onomatopoeia", "Oxymoron"], correct: 1, exp: "A direct comparison without 'like' or 'as'." },
    { q: "Which linguistic theory suggests that humans are born with an innate ability to acquire language?", options: ["Behaviorism", "Nativism (Universal Grammar)", "Constructivism", "Interactionism"], correct: 1, exp: "Noam Chomsky proposed that humans have a Language Acquisition Device." },
    { q: "In 'The Great Gatsby', what does the 'Green Light' at the end of Daisy’s dock represent?", options: ["Gatsby's wealth", "Gatsby's hopes and dreams", "The danger of the ocean", "Daisy's jealousy"], correct: 1, exp: "The light symbolises Gatsby's longing for his dream." },
    { q: "What is the term for the study of how context contributes to meaning?", options: ["Semantics", "Pragmatics", "Sociolinguistics", "Discourse Analysis"], correct: 1, exp: "Pragmatics looks at 'invisible' meaning or speaker intent." },
    { q: "Who is the 'Father of the English Essay'?", options: ["Francis Bacon", "Michel de Montaigne", "Charles Lamb", "Thomas Carlyle"], correct: 0, exp: "While Montaigne invented the form, Bacon popularized it in English." },
    { q: "Which part of the plot provides the background information about characters and the setting?", options: ["Rising Action", "Climax", "Exposition", "Resolution"], correct: 2, exp: "The exposition introduces the status quo." },
    { q: "What is the 'Input Hypothesis' in Second Language Acquisition (SLA)?", options: ["Learning by speaking", "Being exposed to 'comprehensible input' (i + 1)", "Memorizing grammar", "Learning through error correction"], correct: 1, exp: "Stephen Krashen's theory emphasizes receiving understandable messages." },
    { q: "In Victorian Literature, who wrote 'Wuthering Heights'?", options: ["Charlotte Brontë", "Emily Brontë", "Anne Brontë", "George Eliot"], correct: 1, exp: "Emily Brontë published it under the pseudonym Ellis Bell." },
    { q: "What is a 'Portmanteau' word?", options: ["A borrowed word", "A word combining sounds and meanings of two words", "An onomatopoeia", "A word with no plural"], correct: 1, exp: "Example: Smog (Smoke + Fog) or Brunch (Breakfast + Lunch)." }
  ],
  "Science Majorship": [
    { q: "Which law of thermodynamics states that energy cannot be created or destroyed, only transformed from one form to another?", options: ["Zeroth Law", "First Law", "Second Law", "Third Law"], correct: 1, exp: "The First Law of Thermodynamics is the Law of Conservation of Energy." },
    { q: "In a cell, which organelle is responsible for cellular respiration and the production of ATP?", options: ["Ribosome", "Golgi Apparatus", "Mitochondrion", "Lysosome"], correct: 2, exp: "Mitochondria are often called the powerhouse of the cell." },
    { q: "What is the molecular geometry of a water (H₂O) molecule?", options: ["Linear", "Trigonal Planar", "Bent", "Tetrahedral"], correct: 2, exp: "Water has a bent shape due to the two lone pairs of electrons on the oxygen atom." },
    { q: "According to Newton’s Second Law of Motion, if the force applied to an object is doubled while the mass remains constant, the acceleration will:", options: ["Remain the same", "Be halved", "Double", "Quadruple"], correct: 2, exp: "F = ma; force and acceleration are directly proportional when mass is constant." },
    { q: "Which type of chemical bond involves the complete transfer of electrons from one atom to another?", options: ["Covalent Bond", "Ionic Bond", "Hydrogen Bond", "Metallic Bond"], correct: 1, exp: "Ionic bonds usually occur between a metal and a non-metal." },
    { q: "In the periodic table, elements in the same vertical column (group) share similar:", options: ["Atomic masses", "Numbers of neutrons", "Chemical properties and valence electrons", "Physical states at room temperature"], correct: 2, exp: "Groups in the periodic table share the same number of valence electrons." },
    { q: "What is the process by which plants release water vapor into the atmosphere through small openings in their leaves?", options: ["Photosynthesis", "Respiration", "Transpiration", "Condensation"], correct: 2, exp: "Transpiration is the evaporation of water from plant leaves." },
    { q: "A solution with a pH of 3 is considered:", options: ["Strongly Basic", "Weakly Basic", "Neutral", "Strongly Acidic"], correct: 3, exp: "pH values below 7 are acidic; 3 is strongly acidic." },
    { q: "Which layer of the Earth’s atmosphere contains the ozone layer that protects us from ultraviolet radiation?", options: ["Troposphere", "Stratosphere", "Mesosphere", "Thermosphere"], correct: 1, exp: "The ozone layer is located within the stratosphere." },
    { q: "In genetics, what is the phenotypic ratio of a monohybrid cross between two heterozygous parents (Aa × Aa)?", options: ["1:2:1", "3:1", "9:3:3:1", "1:1"], correct: 1, exp: "A monohybrid cross between heterozygotes results in a 3:1 phenotypic ratio." },
    { q: "What is the primary cause of the Earth’s seasons?", options: ["Distance between Earth and Sun", "Rotation on its axis", "Tilt of Earth's axis", "Changes in solar flare activity"], correct: 2, exp: "The tilt of Earth's axis (~23.5 degrees) causes seasonal variations." },
    { q: "Which subatomic particle has a negative charge and negligible mass?", options: ["Proton", "Neutron", "Electron", "Quark"], correct: 2, exp: "Electrons have a negative charge and much less mass than protons or neutrons." },
    { q: "In Physics, what is the unit of measure for electrical resistance?", options: ["Volt", "Ampere", "Ohm", "Watt"], correct: 2, exp: "Ohm is the SI unit of electrical resistance." },
    { q: "What type of rock is formed from the cooling and solidification of magma or lava?", options: ["Sedimentary", "Metamorphic", "Igneous", "Limestone"], correct: 2, exp: "Igneous rocks are formed from solidified molten rock." },
    { q: "Which enzyme in the human digestive system starts the breakdown of starches in the mouth?", options: ["Pepsin", "Lipase", "Amylase", "Trypsin"], correct: 2, exp: "Salivary amylase begins starch digestion in the oral cavity." },
    { q: "What is the half-life of a radioactive isotope?", options: ["Half the time to be created", "Time for half of the sample to decay", "Total life span", "Time to double in mass"], correct: 1, exp: "Half-life is the time it takes for half of the atoms in a sample to decay." },
    { q: "Which planet in our solar system is known as the 'Red Planet' due to iron oxide on its surface?", options: ["Venus", "Mars", "Jupiter", "Saturn"], correct: 1, exp: "Mars appears red because of iron oxide (rust) on its surface." },
    { q: "In a parallel circuit, if one light bulb burns out, what happens to the other bulbs?", options: ["They all go out", "They stay lit", "They become dimmer", "They explode"], correct: 1, exp: "In parallel circuits, electricity has multiple paths, so one failure doesn't stop others." },
    { q: "What is the main product of the Calvin Cycle in photosynthesis?", options: ["Oxygen", "ATP", "G3P (Sugar)", "Carbon Dioxide"], correct: 2, exp: "Glyceraldehyde 3-phosphate (G3P) is the direct product of the Calvin cycle." },
    { q: "Which geological feature is formed at a convergent boundary where an oceanic plate subducts under a continental plate?", options: ["Mid-ocean ridge", "Rift valley", "Trench and Volcanic Arc", "Strike-slip fault"], correct: 2, exp: "Subduction zones create deep ocean trenches and volcanic arcs on land." },
    { q: "What is the chemical formula for Methane?", options: ["CH₄", "C₂H₆", "CO₂", "NH₃"], correct: 0, exp: "Methane is the simplest alkane with formula CH₄." },
    { q: "According to Darwin’s Theory of Evolution, what is the primary mechanism of evolutionary change?", options: ["Genetic Engineering", "Natural Selection", "Spontaneous Generation", "Inheritance of Acquired Characteristics"], correct: 1, exp: "Natural Selection is the survival and reproduction of individuals with favorable traits." },
    { q: "What property of a wave determines its pitch in sound?", options: ["Amplitude", "Frequency", "Velocity", "Phase"], correct: 1, exp: "Frequency determines the perceived pitch of a sound." },
    { q: "Which of the following is a vestigial structure in humans?", options: ["Heart", "Appendix", "Liver", "Lungs"], correct: 1, exp: "The appendix is a structure that has lost most of its ancestral function." },
    { q: "What is the SI unit of power?", options: ["Joule", "Newton", "Watt", "Pascal"], correct: 2, exp: "1 Watt is equal to 1 Joule per second." },
    { q: "Which of the following describes the \"Doppler Effect\"?", options: ["The bending of light as it passes through a medium.", "The change in frequency of a wave in relation to an observer moving relative to the source.", "The reflection of sound waves off a hard surface.", "The total internal reflection of light in a fiber optic cable."], correct: 1, exp: "The Doppler Effect is experienced when the distance between the source of waves and the observer changes, causing a perceived shift in pitch (sound) or color (light)." },
    { q: "What is the correct sequence of the phases of Mitosis?", options: ["Anaphase, Telophase, Prophase, Metaphase", "Prophase, Metaphase, Anaphase, Telophase", "Metaphase, Prophase, Telophase, Anaphase", "Telophase, Anaphase, Metaphase, Prophase"], correct: 1, exp: "The standard mnemonic is PMAT: Prophase (condensation), Metaphase (alignment), Anaphase (separation), and Telophase (division)." },
    { q: "An atom of Carbon-14 has how many neutrons? (Atomic number of Carbon is 6).", options: ["6", "7", "8", "14"], correct: 2, exp: "Neutrons = Mass Number - Atomic Number. 14 - 6 = 8." },
    { q: "Which law states that at a constant temperature, the volume of a gas is inversely proportional to its pressure?", options: ["Charles's Law", "Boyle's Law", "Gay-Lussac's Law", "Avogadro's Law"], correct: 1, exp: "Boyle’s Law (P1V1 = P2V2) describes the inverse relationship between pressure and volume when temperature is constant." },
    { q: "What is the most abundant gas in the Earth's atmosphere?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Argon"], correct: 2, exp: "Nitrogen makes up approximately 78% of the Earth's atmosphere, while Oxygen is about 21%." },
    { q: "In the human heart, which chamber pumps oxygenated blood to the rest of the body?", options: ["Right Atrium", "Right Ventricle", "Left Atrium", "Left Ventricle"], correct: 3, exp: "The Left Ventricle has the thickest muscular wall because it must pump blood through the aorta to the entire systemic circulation." },
    { q: "What type of lens is used to correct myopia (nearsightedness)?", options: ["Convex lens", "Concave lens", "Bifocal lens", "Cylindrical lens"], correct: 1, exp: "Myopia occurs when light focuses in front of the retina; a concave (diverging) lens spreads the light out to push the focal point back onto the retina." },
    { q: "Which chemical principle states that \"electrons fill lower-energy orbitals before filling higher-energy ones\"?", options: ["Pauli Exclusion Principle", "Hund’s Rule", "Aufbau Principle", "Heisenberg Uncertainty Principle"], correct: 2, exp: "\"Aufbau\" is German for \"building up,\" referring to the order in which electrons occupy subshells." },
    { q: "Which of the following is an example of a chemical change?", options: ["Melting ice", "Dissolving sugar in water", "Iron rusting", "Breaking glass"], correct: 2, exp: "Rusting is a chemical reaction (oxidation) that creates a new substance (iron oxide). The others are physical changes." },
    { q: "The Richter scale is used to measure the __________ of an earthquake.", options: ["Intensity", "Magnitude", "Duration", "Depth"], correct: 1, exp: "Magnitude measures the energy released (Richter/Moment Magnitude), while Intensity (Mercalli) measures the damage caused." },
    { q: "Which organic molecule is the primary source of quick energy for living organisms?", options: ["Proteins", "Lipids", "Nucleic Acids", "Carbohydrates"], correct: 3, exp: "Carbohydrates like glucose are easily broken down to produce ATP during cellular respiration." },
    { q: "What is the value of the acceleration due to gravity on Earth?", options: ["8.9 m/s²", "9.8 m/s²", "10.5 m/s²", "32.2 m/s²"], correct: 1, exp: "Standard gravity (g) is approximately 9.8 m/s² downward." },
    { q: "In an ecosystem, which of the following describes the \"Niche\"?", options: ["The physical location where an organism lives.", "The role or function of an organism within its community.", "A group of organisms of the same species.", "The total number of organisms in an area."], correct: 1, exp: "While a \"habitat\" is the address, the \"niche\" is the \"profession\" or role the organism plays." },
    { q: "What is the oxidation number of Hydrogen in H₂O?", options: ["-1", "0", "+1", "+2"], correct: 2, exp: "In most compounds (except metal hydrides), Hydrogen has an oxidation state of +1." },
    { q: "Which planet is known for having the most extensive and visible ring system?", options: ["Jupiter", "Neptune", "Saturn", "Uranus"], correct: 2, exp: "While all gas giants have rings, Saturn's rings are the most prominent and made largely of ice particles." },
    { q: "What is the product of mass and velocity?", options: ["Force", "Work", "Momentum", "Power"], correct: 2, exp: "Momentum (p) is calculated as p = mv." },
    { q: "Which kingdom of life consists of organisms that are mostly multicellular, eukaryotic, and heterotrophic by absorption?", options: ["Plantae", "Animalia", "Fungi", "Protista"], correct: 2, exp: "Fungi are decomposers that absorb nutrients from organic matter, unlike animals which ingest food." },
    { q: "What is the term for the movement of molecules from an area of high concentration to an area of low concentration?", options: ["Osmosis", "Diffusion", "Active Transport", "Endocytosis"], correct: 1, exp: "Diffusion is a passive process. Osmosis is a specific type of diffusion involving water through a membrane." },
    { q: "Which element has the highest electronegativity in the periodic table?", options: ["Cesium", "Oxygen", "Fluorine", "Helium"], correct: 2, exp: "Fluorine is the most electronegative element, with a value of approximately 4.0 on the Pauling scale." },
    { q: "What kind of boundary is the San Andreas Fault?", options: ["Convergent", "Diverging", "Transform", "Subduction"], correct: 2, exp: "Transform boundaries occur where two plates slide past each other horizontally." },
    { q: "What is the functional unit of the kidney?", options: ["Neuron", "Nephron", "Alveoli", "Villi"], correct: 1, exp: "The nephron is responsible for filtering blood and forming urine." },
    { q: "According to the Kinetic Molecular Theory, as temperature increases, the average kinetic energy of particles:", options: ["Decreases", "Increases", "Stays the same", "Becomes zero"], correct: 1, exp: "Temperature is a direct measure of the average kinetic energy of the particles in a substance." },
    { q: "Which of the following is a scalar quantity?", options: ["Displacement", "Velocity", "Acceleration", "Speed"], correct: 3, exp: "Speed only has magnitude, while the others are vectors (magnitude and direction)." },
    { q: "What is the main function of the Large Intestine?", options: ["Digestion of proteins", "Absorption of water and salts", "Production of bile", "Storage of glycogen"], correct: 1, exp: "Most nutrient absorption happens in the small intestine; the large intestine reclaims water to form solid waste." },
    { q: "What is the common name for the compound NaHCO₃?", options: ["Table salt", "Vinegar", "Baking soda", "Bleach"], correct: 2, exp: "Sodium bicarbonate is baking soda. Sodium chloride is table salt (NaCl)." },
    { q: "Which property of water allows insects like water striders to walk on its surface?", options: ["Adhesion", "High specific heat", "Surface tension", "Capillary action"], correct: 2, exp: "Surface tension is caused by the cohesion of water molecules at the surface." },
    { q: "What is the boiling point of water in the Kelvin scale?", options: ["100 K", "212 K", "273 K", "373 K"], correct: 3, exp: "K = °C + 273.15. Since water boils at 100°C, the Kelvin equivalent is ~373 K." },
    { q: "The theory that describes the origin of the universe from a single point of infinite density is the:", options: ["Steady State Theory", "Big Bang Theory", "Nebular Hypothesis", "Pulsating Universe Theory"], correct: 1, exp: "The Big Bang Theory is the prevailing cosmological model for the universe's birth." },
    { q: "What is the work done if a 10 N force moves an object 5 meters in the direction of the force?", options: ["2 Joules", "15 Joules", "50 Joules", "0 Joules"], correct: 2, exp: "Work = Force x Distance. 10 x 5 = 50 J." },
    { q: "Which type of RNA carries the genetic code from the DNA in the nucleus to the ribosomes?", options: ["mRNA", "tRNA", "rRNA", "snRNA"], correct: 0, exp: "Messenger RNA (mRNA) acts as the bridge between DNA and protein synthesis." },
    { q: "What is the pH of a neutral solution at 25°C?", options: ["0", "1", "7", "14"], correct: 2, exp: "On the pH scale of 0–14, 7 is the neutral point (like pure water)." },
    { q: "Which mineral is the hardest on the Mohs scale?", options: ["Quartz", "Talc", "Diamond", "Corundum"], correct: 2, exp: "Diamond is rated 10 on the Mohs scale, making it the hardest natural mineral." },
    { q: "A change in the DNA sequence is known as a:", options: ["Translation", "Transcription", "Mutation", "Replication"], correct: 2, exp: "Mutations can be beneficial, neutral, or harmful changes to the genetic code." },
    { q: "Which law of motion explains why a person moves forward when a car suddenly stops?", options: ["Law of Inertia", "Law of Acceleration", "Law of Interaction", "Law of Gravitation"], correct: 0, exp: "Newton's First Law (Inertia) states that an object in motion tends to stay in motion unless acted upon by an external force." },
    { q: "What is the total number of chromosomes in a normal human somatic cell?", options: ["23", "44", "46", "48"], correct: 2, exp: "Humans have 23 pairs of chromosomes, totaling 46. Gametes (sperm/egg) have 23." }
  ],
  "TLE Majorship": [
    { q: "In Cookery, what is the 'Danger Zone' temperature range where bacteria multiply most rapidly?", options: ["0°C to 4°C", "4°C to 60°C", "60°C to 100°C", "-18°C to 0°C"], correct: 1, exp: "Foods should not be left in this range (4°C to 60°C) for more than two hours." },
    { q: "Which type of kitchen knife is considered an all-purpose tool used for chopping, slicing, and mincing?", options: ["Paring Knife", "Serrated Knife", "Chef’s Knife (French Knife)", "Cleaver"], correct: 2, exp: "The Chef's knife is the most versatile knife in the kitchen." },
    { q: "In Carpentry, what tool is used to test the vertical and horizontal squareness of a surface?", options: ["Plumb Bob", "Try Square", "Level Bar", "Chalk Line"], correct: 1, exp: "A try square is used for marking and checking 90° angles." },
    { q: "What is the process of removing the internal organs of poultry called?", options: ["Scalding", "Evisceration", "Dressing", "Defeathering"], correct: 1, exp: "Evisceration is the removal of internal organs." },
    { q: "In Cookery, what is the 'Danger Zone' temperature range where bacteria multiply most rapidly?", options: ["0°C to 4°C", "4°C to 60°C", "60°C to 100°C", "-18°C to 0°C"], correct: 1, exp: "Foods should not be left in this range (4°C to 60°C) for more than two hours." },
    { q: "Which type of kitchen knife is considered an all-purpose tool used for chopping, slicing, and mincing?", options: ["Paring Knife", "Serrated Knife", "Chef’s Knife (French Knife)", "Cleaver"], correct: 2, exp: "The Chef's knife is the most versatile knife in the kitchen." },
    { q: "In Carpentry, what tool is used to test the vertical and horizontal squareness of a surface?", options: ["Plumb Bob", "Try Square", "Level Bar", "Chalk Line"], correct: 1, exp: "A try square is used for marking and checking 90° angles." },
    { q: "What is the process of removing the internal organs of poultry called?", options: ["Scalding", "Evisceration", "Dressing", "Defeathering"], correct: 1, exp: "Evisceration is the removal of internal organs." },
    { q: "In Electronics, what component is used to oppose the flow of electric current?", options: ["Capacitor", "Transistor", "Resistor", "Diode"], correct: 2, exp: "Resistors oppose current flow and are measured in Ohms." },
    { q: "Which sewing machine part holds the fabric in place against the feed dog?", options: ["Bobbin Case", "Presser Foot", "Needle Bar", "Balance Wheel"], correct: 1, exp: "The presser foot exerts downward pressure on the fabric." },
    { q: "In Agriculture, what is the process of transferring a seedling from a nursery tray to the permanent field?", options: ["Thinning", "Pruning", "Transplanting", "Grafting"], correct: 2, exp: "Transplanting moves a plant to its final growing location." },
    { q: "Which type of fire extinguisher is specifically used for electrical fires (Class C)?", options: ["Water", "Carbon Dioxide (CO2) or Dry Chemical", "Foam", "Wet Chemical"], correct: 1, exp: "CO2 or dry chemicals are used as they are non-conductive." },
    { q: "In Beauty Care, what is the term for the white, half-moon shape at the base of the nail?", options: ["Cuticle", "Free Edge", "Lunula", "Matrix"], correct: 2, exp: "The lunula is the visible part of the nail matrix." },
    { q: "What is the process of preserving food by using high concentrations of salt to draw out moisture?", options: ["Pickling", "Curing", "Fermentation", "Dehydration"], correct: 1, exp: "Curing uses salt to preserve food by reducing water activity." },
    { q: "In ICT, what is the 'brain' of the computer that performs all processing tasks?", options: ["RAM", "Hard Drive", "Central Processing Unit (CPU)", "Motherboard"], correct: 2, exp: "The CPU executes instructions and processes data." },
    { q: "Which drafting tool is used for drawing horizontal lines and as a guide for triangles?", options: ["Protractor", "Compass", "T-Square", "French Curve"], correct: 2, exp: "A T-square provides a straight horizontal reference edge." },
    { q: "In Masonry, what is the ratio of cement, sand, and gravel for a Class A concrete mixture?", options: ["1:2:3", "1:2:4", "1:3:6", "1:1.5:3"], correct: 1, exp: "Class A concrete follows a 1:2:4 ratio." },
    { q: "What do you call the profit left after all expenses and taxes have been deducted from the total revenue?", options: ["Gross Profit", "Net Profit", "Capital", "Asset"], correct: 1, exp: "Net profit is the final profit after all costs." },
    { q: "In Plumbing, what device is used to prevent sewer gases from entering the building while allowing waste to pass through?", options: ["Valve", "Coupling", "P-Trap", "Elbow"], correct: 2, exp: "A P-trap holds a water seal that blocks gases." },
    { q: "Which method of cooking involves submerging food in hot fat, usually oil?", options: ["Sautéing", "Braising", "Deep-frying", "Poaching"], correct: 2, exp: "Deep-frying involves complete immersion in hot fat." },
    { q: "In Cosmetology, what is the study of the structure, functions, and diseases of the skin?", options: ["Trichology", "Dermatology", "Osteology", "Neurology"], correct: 1, exp: "Dermatology is the medical branch focused on skin health." },
    { q: "What do you call a person who organizes, operates, and assumes the risk for a business venture?", options: ["Manager", "Employee", "Entrepreneur", "Investor"], correct: 2, exp: "An entrepreneur takes risks to start a business." },
    { q: "In Electrical House Wiring, what color of wire is standardly used for the 'Ground' wire?", options: ["Black", "Red", "Green or Yellow-Green", "Blue"], correct: 2, exp: "Green or yellow-green signifies a ground connection." },
    { q: "Which propagation method involves joining a scion (top part) with a rootstock?", options: ["Layering", "Marcotting", "Grafting", "Cutting"], correct: 2, exp: "Grafting connects parts from two different plants." },
    { q: "In Graphic Design, what are the primary colors in the subtractive (CMYK) model used for printing?", options: ["Red, Green, Blue", "Cyan, Magenta, Yellow, Black", "Orange, Purple, Green", "White, Gray, Black"], correct: 1, exp: "CMYK is the standard color model for print media." },
    { q: "Which stitch is used to provide a decorative finish to the edge of a blanket or thick fabric?", options: ["Running stitch", "Backstitch", "Blanket stitch", "Chain stitch"], correct: 2, exp: "Blanket stitch is used to finish edges of thick materials." },
    { q: "In Animal Production, what is the term for a castrated male pig?", options: ["Boar", "Sow", "Gilt", "Barrow"], correct: 3, exp: "A barrow is a male pig castrated at an early age." },
    { q: "What is the tool used to remove the insulation from electrical wires?", options: ["Side Cutting Pliers", "Long Nose Pliers", "Wire Stripper", "Utility Knife"], correct: 2, exp: "Wire strippers safely remove insulation from wires." },
    { q: "In Food Processing, what is the term for heating food to a specific temperature to kill harmful microorganisms without changing the food's composition?", options: ["Sterilization", "Pasteurization", "Blanching", "Homogenization"], correct: 1, exp: "Pasteurization uses heat to kill pathogens safely." }
  ],
  "Mathematics Majorship": [
    { q: "What is the remainder when f(x) = 2x³ - 5x² + 3x + 7 is divided by x - 2?", options: ["7", "9", "5", "11"], correct: 1, exp: "Using the Remainder Theorem, f(2) = 2(2)³ - 5(2)² + 3(2) + 7 = 16 - 20 + 6 + 7 = 9." },
    { q: "In a circle with radius 10 cm, what is the length of an arc that subtends a central angle of 60°?", options: ["5π/3 cm", "10π/3 cm", "10π cm", "20π cm"], correct: 1, exp: "s = rθ; convert 60° to π/3 radians. 10 × π/3 = 10π/3." },
    { q: "Which of the following is the derivative of f(x) = ln(x² + 1)?", options: ["1 / (x² + 1)", "2x / (x² + 1)", "2x(x² + 1)", "x / (x² + 1)"], correct: 1, exp: "Using the Chain Rule: d/dx[ln(u)] = (1/u)(du/dx). Here, u = x²+1, so du/dx = 2x." },
    { q: "What is the value of the limit lim (x→0) (sin 5x / x)?", options: ["0", "1", "5", "Undefined"], correct: 2, exp: "Based on the special limit lim (x→0) sin(ax)/x = a." },
    { q: "If matrix A = [[2, 3], [1, 4]], what is the determinant of A?", options: ["11", "5", "8", "2"], correct: 1, exp: "Det = (2 × 4) - (3 × 1) = 8 - 3 = 5." },
    { q: "How many ways can a committee of 3 be chosen from a group of 7 people?", options: ["21", "35", "210", "42"], correct: 1, exp: "Combination formula: nCr = n! / (r!(n-r)!). 7C3 = 7! / (3!4!) = 35." },
    { q: "What is the slope of a line perpendicular to the line 2x - 3y = 6?", options: ["2/3", "-3/2", "3/2", "-2/3"], correct: 1, exp: "The slope of 2x - 3y = 6 is 2/3. The perpendicular slope is the negative reciprocal: -3/2." },
    { q: "In a standard normal distribution, what percentage of the area falls between z = -1 and z = 1?", options: ["50%", "68%", "95%", "34%"], correct: 1, exp: "According to the Empirical Rule (68-95-99.7), approximately 68% of data falls within one standard deviation of the mean." },
    { q: "What is the sum of the interior angles of a convex hexagon?", options: ["360°", "720°", "540°", "900°"], correct: 1, exp: "Formula: (n-2) × 180°. For a hexagon (n=6), (6-2) × 180° = 720°." },
    { q: "Find the value of x in the equation 4^(x+1) = 64.", options: ["2", "3", "1", "4"], correct: 0, exp: "4^(x+1) = 4³. Therefore, x + 1 = 3, so x = 2." },
    { q: "Which property of real numbers is illustrated by a(b + c) = ab + ac?", options: ["Associative", "Commutative", "Distributive", "Identity"], correct: 2, exp: "This is the Distributive Property of multiplication over addition." },
    { q: "What is the center and radius of the circle (x - 3)² + (y + 2)² = 25?", options: ["Center (3, -2), Radius 5", "Center (-3, 2), Radius 5", "Center (3, -2), Radius 25", "Center (-3, 2), Radius 25"], correct: 0, exp: "Equation form is (x-h)² + (y-k)² = r². h=3, k=-2, r=√25=5." },
    { q: "Two fair dice are rolled. What is the probability that the sum of the faces is 7?", options: ["1/12", "1/6", "5/36", "1/36"], correct: 1, exp: "Possible outcomes for sum of 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1). Total 6 outcomes out of 36. 6/36 = 1/6." },
    { q: "Evaluate the integral ∫(3x² + 2x) dx.", options: ["x³ + x² + C", "6x + 2 + C", "3x³ + 2x² + C", "x³ + 2x² + C"], correct: 0, exp: "Using the power rule for integration: x³/3 and x²/2. ∫3x² dx = x³; ∫2x dx = x²." },
    { q: "If sin θ = 3/5 and θ is in Quadrant II, what is cos θ?", options: ["4/5", "-4/5", "3/4", "-3/4"], correct: 1, exp: "In Quadrant II, cosine is negative. Using x² + y² = r²: x² + 3² = 5² → x = 4. cos θ = -4/5." },
    { q: "What is the nth term of the arithmetic sequence 5, 9, 13, 17...?", options: ["4n + 1", "4n + 5", "5n + 4", "n + 4"], correct: 0, exp: "an = a₁ + (n-1)d. an = 5 + (n-1)4 = 5 + 4n - 4 = 4n + 1." },
    { q: "A statement that is assumed to be true without proof is a/an:", options: ["Theorem", "Corollary", "Postulate (Axiom)", "Lemma"], correct: 2, exp: "Postulates or axioms are basic assumptions used as the basis for reasoning." },
    { q: "What is the mode of the following data set: 2, 4, 4, 5, 6, 7, 7, 7, 8?", options: ["4", "5", "7", "6"], correct: 2, exp: "The mode is the value that appears most frequently. 7 appears three times." },
    { q: "Solve for x in the inequality |x - 3| < 5.", options: ["x < 8", "-2 < x < 8", "x > -2", "x < -2 or x > 8"], correct: 1, exp: "-5 < x - 3 < 5. Adding 3 to all sides gives -2 < x < 8." },
    { q: "What is the period of the function y = sin(2x)?", options: ["2π", "π", "π/2", "4π"], correct: 1, exp: "Period = 2π / |b|. Here b = 2, so Period = 2π / 2 = π." },
    { q: "In how many ways can 5 people be seated in a round table?", options: ["120", "24", "60", "25"], correct: 1, exp: "Circular permutation formula: (n - 1)!. For 5 people: (5 - 1)! = 4! = 24." },
    { q: "If 3x + 2y = 12 and x - y = 4, find y.", options: ["4", "0", "2", "-2"], correct: 1, exp: "From the second eq, x = y + 4. Substitute into first: 3(y+4) + 2y = 12 → 3y + 12 + 2y = 12 → 5y = 0 → y = 0." },
    { q: "What is the inverse of the function f(x) = 2x - 3?", options: ["f⁻¹(x) = (x + 3) / 2", "f⁻¹(x) = (x - 3) / 2", "f⁻¹(x) = 2x + 3", "f⁻¹(x) = 3x - 2"], correct: 0, exp: "Let y = 2x - 3. Swap x and y: x = 2y - 3. Solve for y: y = (x + 3) / 2." },
    { q: "Which of the following is an irrational number?", options: ["0.333...", "√16", "π", "22/7"], correct: 2, exp: "π cannot be expressed as a simple fraction and its decimal representation never ends or repeats." },
    { q: "A triangle with sides 3, 4, and 5 is a/an:", options: ["Isosceles triangle", "Right triangle", "Equilateral triangle", "Obtuse triangle"], correct: 1, exp: "It satisfies the Pythagorean theorem: 3² + 4² = 5² (9 + 16 = 25)." },
    { q: "What is the greatest common divisor (GCD) of 48 and 180?", options: ["6", "12", "24", "36"], correct: 1, exp: "Prime factors: 48 = 2⁴ × 3; 180 = 2² × 3² × 5. The GCD is 2² × 3 = 12." },
    { q: "Which of the following is the measure of each exterior angle of a regular octagon?", options: ["45°", "60°", "135°", "120°"], correct: 0, exp: "The sum of exterior angles for any polygon is 360°. For an octagon (n=8): 360/8 = 45°." },
    { q: "If the roots of a quadratic equation are 3 and -5, what is the equation?", options: ["x² - 2x - 15 = 0", "x² + 2x - 15 = 0", "x² + 8x + 15 = 0", "x² - 8x + 15 = 0"], correct: 1, exp: "Using (x - r₁)(x - r₂) = 0: (x - 3)(x + 5) = x² + 2x - 15 = 0." },
    { q: "What is the volume of a right circular cone with radius 3 cm and height 7 cm?", options: ["21π cm³", "63π cm³", "7π cm³", "49π cm³"], correct: 0, exp: "V = (1/3)πr²h = (1/3)π(3²)(7) = (1/3)π(9)(7) = 21π cm³." },
    { q: "Evaluate: log₂(32) + log₃(27).", options: ["5", "8", "15", "6"], correct: 1, exp: "log₂(32) = 5 (since 2⁵=32) and log₃(27) = 3 (since 3³=27). 5 + 3 = 8." },
    { q: "In the set {10, 20, 30, 40, 50}, if 50 is replaced by 100, which measure changes the most?", options: ["Median", "Mode", "Mean", "None of these"], correct: 2, exp: "The mean is sensitive to outliers and extreme values. It will change significantly." },
    { q: "What is the value of 10!/8!?", options: ["90", "18", "2", "80"], correct: 0, exp: "10! = 10 × 9 × 8!. Thus 10!/8! = 10 × 9 = 90." },
    { q: "A car travels 120 km in 2 hours. At this rate, how long will it take to travel 300 km?", options: ["4 hours", "5 hours", "6 hours", "4.5 hours"], correct: 1, exp: "Speed = 120/2 = 60 km/h. Time = Distance/Speed = 300/60 = 5 hours." },
    { q: "What is the slope of the line tangent to y = x² at the point (2, 4)?", options: ["2", "4", "1", "0"], correct: 1, exp: "The derivative y' = 2x. At x = 2, the slope m = 2(2) = 4." },
    { q: "If a = 2 and b = -3, what is the value of a² - 2ab + b²?", options: ["1", "25", "5", "13"], correct: 1, exp: "This is (a - b)². Substituting: (2 - (-3))² = (5)² = 25." },
    { q: "How many subsets does a set with 5 elements have?", options: ["10", "25", "32", "16"], correct: 2, exp: "The formula for the number of subsets of a set with n elements is 2ⁿ. 2⁵ = 32." },
    { q: "What is the measure of the supplementary angle of 75°?", options: ["15°", "105°", "25°", "285°"], correct: 1, exp: "Supplementary angles sum to 180°. 180° - 75° = 105°." },
    { q: "A box contains 5 red balls and 3 blue balls. If two balls are drawn with replacement, what is the probability both are red?", options: ["25/64", "5/14", "10/64", "15/56"], correct: 0, exp: "Probability of red is 5/8. With replacement: (5/8) × (5/8) = 25/64." },
    { q: "Simplify: (x⁵y²)/(x²y⁻³)", options: ["x³y⁻¹", "x⁷y⁵", "x³y⁵", "x⁷y⁻¹"], correct: 2, exp: "Using quotient rule: x⁵⁻² = x³ and y²⁻(⁻³) = y⁵. Result: x³y⁵." },
    { q: "What is the sum of the first 10 terms of the arithmetic sequence 2, 4, 6, 8...?", options: ["100", "110", "120", "200"], correct: 1, exp: "Sₙ = (n/2)(2a₁ + (n-1)d). S₁₀ = (10/2)(2(2) + (9)2) = 5(4 + 18) = 110." },
    { q: "What is the domain of the function f(x) = √(x - 4)?", options: ["x < 4", "x > 4", "x ≥ 4", "All real numbers"], correct: 2, exp: "For square roots, the radicand must be ≥ 0. x - 4 ≥ 0 implies x ≥ 4." },
    { q: "The identity element for multiplication is:", options: ["0", "-1", "1", "Does not exist"], correct: 2, exp: "Multiplying any number by 1 results in the same number (a × 1 = a)." },
    { q: "If the area of a square is 64 sq. units, what is its perimeter?", options: ["16", "32", "24", "64"], correct: 1, exp: "Area s² = 64 implies s = 8. Perimeter = 4s = 4(8) = 32." },
    { q: "In logic, a statement that is always true is called a:", options: ["Fallacy", "Contradiction", "Tautology", "Negation"], correct: 2, exp: "A tautology is a compound statement that is true for all possible truth values." },
    { q: "What is the value of cos(0°)?", options: ["0", "1", "Undefined", "0.5"], correct: 1, exp: "On the unit circle, the coordinates at 0° are (1,0). The x-coordinate represents cosine." },
    { q: "The angles of a triangle are in a ratio of 1:2:3. What is the largest angle?", options: ["60°", "90°", "120°", "45°"], correct: 1, exp: "x + 2x + 3x = 180 implies 6x = 180 implies x = 30. Largest angle is 3(30) = 90°." },
    { q: "What is the midpoint of the segment connecting (2, 5) and (8, -1)?", options: ["(5, 2)", "(10, 4)", "(3, 3)", "(5, 3)"], correct: 0, exp: "Midpoint = ((2+8)/2, (5+(-1))/2) = (10/2, 4/2) = (5, 2)." },
    { q: "If 20% of a number is 40, what is the number?", options: ["80", "200", "120", "400"], correct: 1, exp: "0.20x = 40 implies x = 40/0.20 = 200." },
    { q: "Which of the following is a prime number?", options: ["9", "15", "21", "2"], correct: 3, exp: "2 is the only even prime number. 9, 15, and 21 are composite." },
    { q: "Find the limit as x approaches infinity of (2x + 1)/(x - 3).", options: ["1", "0", "2", "Infinity"], correct: 2, exp: "For limits at infinity with equal degrees, the limit is the ratio of leading coefficients (2/1 = 2)." },
    { q: "What is the area of a triangle with base 10 and height 12?", options: ["120", "60", "22", "50"], correct: 1, exp: "Area = (1/2) × base × height = (1/2)(10)(12) = 60." },
    { q: "Which of the following describes the set of integers?", options: ["{1, 2, 3...}", "{...-2, -1, 0, 1, 2...}", "{0, 1, 2...}", "{..., -0.5, 0, 0.5, ...}"], correct: 1, exp: "Integers consist of zero, positive natural numbers, and their negatives." },
    { q: "Convert 3π/2 radians to degrees.", options: ["90°", "180°", "270°", "360°"], correct: 2, exp: "Substitute π with 180°: (3 × 180)/2 = 270°." },
    { q: "What is the length of the hypotenuse of a right triangle with legs 5 and 12?", options: ["13", "17", "7", "25"], correct: 0, exp: "c² = 5² + 12² = 25 + 144 = 169. c = √169 = 13." },
    { q: "If f(x) = x² - 4, find f(3).", options: ["2", "5", "9", "1"], correct: 1, exp: "Plug 3 into x: 3² - 4 = 9 - 4 = 5." },
    { q: "How many vertices does a cube have?", options: ["6", "8", "12", "4"], correct: 1, exp: "A cube has 6 faces, 12 edges, and 8 corner points (vertices)." },
    { q: "What is the coefficient of the third term in the expansion of (x + y)⁴?", options: ["1", "4", "6", "10"], correct: 2, exp: "Using Pascal's triangle for n=4, the coefficients are 1, 4, 6, 4, 1. The third term is 6." },
    { q: "What is the base of the natural logarithm?", options: ["10", "2", "e", "π"], correct: 2, exp: "The natural logarithm 'ln' specifically refers to log base e." },
    { q: "Solve for x: 3(x - 4) = 2x + 5", options: ["9", "17", "12", "1"], correct: 1, exp: "3x - 12 = 2x + 5 implies 3x - 2x = 5 + 12 implies x = 17." },
    { q: "What is the value of i² in complex numbers?", options: ["1", "-1", "√(-1)", "0"], correct: 1, exp: "By definition, i = √(-1), so i² = -1." }
  ]
};

// Add a placeholder for the new "Laws in Education" quiz
quizzes["Laws in Education"] = [
  { q: "Which Philippine law mandates free tuition in state universities and colleges?", options: ["RA 10931", "RA 7722", "RA 9155", "RA 4670"], correct: 0, exp: "RA 10931 is the Universal Access to Quality Tertiary Education Act." }
];

// Quiz Functions
async function takeQuiz(topic) {
  if (!quizzes[topic] && topic !== 'Major Specialization') {
    return showToast("Quiz content for " + topic + " coming soon!", "info");
  }

  // Determine amount: Gen Ed/Prof Ed = 20, Majorship = 40
  const isMajorship = topic.toLowerCase().includes('majorship') || topic === 'Major Specialization';
  const amount = isMajorship ? 40 : 20;

  const success = await deductCredits(amount);
  if (!success) {
    showToast("Insufficient credits! Please top up.", "error");
    return showPage('creditsPlanPage');
  }
  showToast(`You used your ${amount} credits for your FlashReview! Good luck!`, "info");

  activeQuizTopic = topic;
  currentQuizData = [...quizzes[topic]]; // Use a copy to avoid modifying original pool
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
  
  const percent = (quizScore / currentQuizData.length) * 100;
  if (percent >= 75) {
    document.getElementById('resultIcon').textContent = "🏆";
    document.getElementById('resultFeedback').textContent = "Excellent! You are ready for the board!";
  } else {
    document.getElementById('resultIcon').textContent = "📚";
    document.getElementById('resultFeedback').textContent = "Keep practicing! You can do it.";
  }

  // Save results to Firestore
  saveQuizResult(activeQuizTopic, quizScore, currentQuizData.length);
}

function restartQuiz() {
  takeQuiz(activeQuizTopic);
}

function confirmExitQuiz() {
  showToast("Warning: If you leave now, the credits you used will be wasted!", "error");
  if (confirm("Are you sure you want to exit? Your used credits will not be refunded and progress will be lost.")) {
    showPage('courseSelectionPage');
  }
}

// Firebase - Global (no import)
let auth;
let db;

// Load Firebase safely
function initFirebase() {
  const scriptApp = document.createElement('script');
  scriptApp.src = 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js';
  scriptApp.onload = () => {
    const scriptAuth = document.createElement('script');
    scriptAuth.src = 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth-compat.js';
    scriptAuth.onload = () => {
      const scriptFirestore = document.createElement('script');
      scriptFirestore.src = 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore-compat.js';
      scriptFirestore.onload = () => {
        if (typeof firebaseConfig === 'undefined') {
          console.error('❌ firebaseConfig is not defined. Check firebase-config.js');
          return;
        }
        firebase.initializeApp(firebaseConfig);
        auth = firebase.auth();
        db = firebase.firestore();
        firebase.auth().onAuthStateChanged(onAuthChanged);
        console.log('✅ Firebase Auth & Firestore ready');
      };
      document.head.appendChild(scriptFirestore);
    };
    document.head.appendChild(scriptAuth);
  };
  document.head.appendChild(scriptApp);
}

// Auth state
function onAuthChanged(user) {
  if (user) {
    const userRef = db.collection('users').doc(user.uid);
    // Block access if email is not verified to prevent fake accounts
    if (!user.emailVerified) {
      auth.signOut().then(() => {
        showToast('📩 Check your Gmail (Inbox or Spam)!', 'error');
      });
      return;
    }

    // Fetch user data including credits
    userRef.get().then(doc => {
      let userData = doc.exists ? doc.data() : {
        credits: 100,
        isVIP: false,
        username: user.displayName || user.email.split('@')[0]
      };

      // Fetch global settings for allFreeMode
      db.collection('settings').doc('global').get().then(globalSettingsDoc => {
        if (globalSettingsDoc.exists) {
          window.allFreeMode = globalSettingsDoc.data().allFreeMode || false;
        } else {
          db.collection('settings').doc('global').set({ allFreeMode: false }, { merge: true });
        }
      }).catch(e => console.error("Error fetching global settings:", e));
      // Automatically grant admin if the signed-in username matches the master admin username
      if (userData.username === 'admin_v1nce' && !userData.isAdmin) {
        userData.isAdmin = true;
        if (doc.exists) {
          userRef.update({ isAdmin: true }).catch(e => console.error('Admin grant failed:', e));
        } else {
          userData.isAdmin = true;
        }
      }

      if (!doc.exists) {
        // If a user logs in but their document doesn't exist, it means their profile data was deleted.
        // This should not recreate the user, but rather log them out or prevent access.
        console.warn(`User ${user.uid} logged in but their Firestore user document is missing. Logging out.`);
        auth.signOut();
        return;
      }

      // Update last seen status and start heartbeat
      const updateStatus = () => {
        if (db && auth.currentUser) {
          db.collection('users').doc(auth.currentUser.uid).update({
            lastSeen: firebase.firestore.FieldValue.serverTimestamp()
          }).catch(() => {});
        }
      };
      updateStatus();
      if (window.statusHeartbeat) clearInterval(window.statusHeartbeat);
      window.statusHeartbeat = setInterval(updateStatus, 60000);

      currentUser = {
        uid: user.uid,
        email: user.email,
        name: user.displayName || user.email.split('@')[0],
        fullName: userData.fullName || user.displayName || 'User',
        major: userData.major || 'General',
        gender: userData.gender || 'Prefer not to say', // Use userData.gender if available
        credits: userData.credits,
        isVIP: userData.isVIP || false,
        isAdmin: userData.isAdmin || false, // New: Admin flag
        isBanned: userData.isBanned || false // New: Banned flag
      };
      
      // Apply allFreeMode if active, overriding individual user settings client-side
      if (window.allFreeMode) {
        currentUser.isVIP = true;
        currentUser.credits = Infinity; // Represent unlimited access
      }

      updateCreditsUI();
      updateAdminUI();
      listenToNotifications();
      if (document.getElementById('courseCardsContainer')) renderCourseSelection();

      // Check admin access for adminpanel.html
      if (window.location.pathname.includes('adminpanel.html')) {
        if (!currentUser.isAdmin) {
          alert('Access Denied: Admin privileges required.');
          window.location.href = 'index.html';
        } else {
          // Initialize terminal for admin
          setTimeout(() => {
            if (typeof appendToTerminal === 'function') {
              appendToTerminal('Welcome to Admin Panel, ' + currentUser.name + '!');
              appendToTerminal('Type /help for available commands.');
            }
          }, 100);
        }
      }

      // Redirect to main menu if user is already logged in and verified but still on auth page
      if (window.location.pathname.includes('auth.html') || window.location.pathname.includes('index.html') && currentPage === 'landingPage') {
        window.location.href = 'index.html';
      }

      // Check if user is banned
      if (currentUser.isBanned) {
        auth.signOut().then(() => {
          showToast('Your account has been banned.', 'error');
          // Redirect to landing page or a specific banned page
          window.location.href = 'index.html';
        });
        return; // Stop further processing for banned users
      }
    });

    // Only reset history if we are genuinely coming from the landing page
    if (navigationHistory.includes('landingPage')) navigationHistory = ['courseSelectionPage']; 
    
    // Only attempt SPA navigation if we are on the main dashboard (index.html)
    if (document.getElementById('courseCardsContainer')) {
      renderCourseSelection();
      showPage('courseSelectionPage', true);
    }
    syncUserToLeaderboard(); // Automatically add/update user in leaderboard
  } else {
    currentUser = null;
    navigationHistory = ['landingPage'];
    
    // If not logged in, ensure we are redirected to the landing page
    if (document.getElementById('landingPage')) {
      if (currentPage !== 'landingPage') showPage('landingPage', true);
    } else {
      // If not on index.html and not on auth.html, redirect back to index
      if (!window.location.pathname.includes('auth.html')) {
        window.location.href = 'index.html';
      }
    }
  }
}

/**
 * Ensures the user's name appears on the leaderboard immediately after login
 */
async function syncUserToLeaderboard() {
  if (!currentUser || !db) return;
  try {
    await db.collection('leaderboard').doc(currentUser.uid).set({
      name: currentUser.name,
      major: currentUser.major,
      gender: currentUser.gender
    }, { merge: true });
  } catch (e) {
    console.error("Leaderboard Sync Error:", e);
  }
}

function updateCreditsUI() {
  const display = document.getElementById('userCreditsDisplay');
  if (display && currentUser) {
    if (window.allFreeMode) {
      display.textContent = "FREE ∞";
    } else {
      display.textContent = currentUser.isVIP ? "VIP ∞" : currentUser.credits;
    }
  }
}

function updateAdminUI() {
  const adminBtn = document.getElementById('adminButton');
  if (adminBtn && currentUser) {
    adminBtn.style.display = currentUser.name === 'admin_v1nce' ? 'block' : 'none';
  }
}

async function deductCredits(amount) {
  if (!currentUser || currentUser.isVIP) return true;
  if (currentUser.credits < amount) return false;

  // If allFreeMode is active, no credits are deducted
  if (window.allFreeMode) {
    return true;
  }

  try {
    const userRef = db.collection('users').doc(currentUser.uid);
    await userRef.update({ credits: firebase.firestore.FieldValue.increment(-amount) });
    currentUser.credits -= amount;
    updateCreditsUI();
    return true;
  } catch (e) {
    console.error("Credit deduction failed:", e);
    return false;
  }
}

// Generate Dynamic Course Cards
function renderCourseSelection() {
  const container = document.getElementById('courseCardsContainer');
  if (!container || !currentUser) return;

  const nameDisplay = document.getElementById('userDisplayName');
  if (nameDisplay) nameDisplay.textContent = `👋 ${currentUser.name}`;

  // Dynamic label based on user major
  let majorDisplay = currentUser.major === 'filipino' ? '(For Filipino MajorShip)' : 
                     currentUser.major === 'tle' ? 'TLE' :
                     currentUser.major.charAt(0).toUpperCase() + currentUser.major.slice(1);

  if (currentUser.major === 'beed') majorDisplay = 'BEED';

  let html = `
    <div class="course-card" onclick="selectCourse('genEd')">
        <div class="course-icon">📘</div>
        <h3>General Education</h3>
        <p>Comprehensive Review</p>
    </div>
    
    <div class="course-card" onclick="selectCourse('profEd')">
        <div class="course-icon">🎓</div>
        <h3>Professional Education</h3>
        <p>Foundations of Teaching</p>
    </div>
  `;

  if (currentUser.major !== 'beed') {
    html += `
    <div class="course-card" onclick="selectCourse('specialization')">
        <div class="course-icon">⭐</div>
        <h3>${majorDisplay}</h3>
        <p>Major Specialization</p>
    </div>
    `;
  }

  html += `
    <div class="course-card" onclick="openLeaderboard()">
        <div class="course-icon">🏆</div>
        <h3>Global Leaderboard</h3>
        <p>Coming Soon</p>
    </div>
  `;
  container.innerHTML = html;
}

// Update Profile Settings
async function updateProfileInfo() {
  const newName = document.getElementById('displayName').value.trim();
  if (!newName) return showToast('Name cannot be empty', 'error');
  
  try {
    await auth.currentUser.updateProfile({ displayName: newName });
    currentUser.name = newName;
    // Update the welcome name immediately
    const nameDisplay = document.getElementById('userDisplayName');
    if (nameDisplay) nameDisplay.textContent = `👋 ${currentUser.name}`;
    showToast('Profile updated!', 'success');
  } catch (e) {
    showToast(e.message, 'error');
  }
}

// Show page
function showPage(pageId, skipHistory = false) {
    const page = document.getElementById(pageId);
    if (page) {
        // Only hide other pages if the target page exists to avoid blank screens on external quiz files
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        
        // Prevent non-admins from accessing the admin panel
        if (pageId === 'adminPanelPage' && (!currentUser || !currentUser.isAdmin)) {
            showToast('Access Denied: Admin privileges required.', 'error');
            return showPage('courseSelectionPage'); // Redirect non-admins
        }
        page.classList.add('active');
        currentPage = pageId;
        // Only push to history if it's a new unique page
        if (!skipHistory && navigationHistory[navigationHistory.length - 1] !== pageId) {
            navigationHistory.push(pageId);
        }
        window.scrollTo(0, 0);
    } else {
        // If the pageId doesn't exist, it might be an external quiz file, so just redirect
        // console.warn(`Page with ID '${pageId}' not found. Attempting direct navigation.`);
        // window.location.href = pageId + '.html'; // This might be too aggressive, depends on app structure
    }
}

// Back
function goBack() {
  // If logged in and at the root, don't go back to landing page
  if (currentUser && navigationHistory.length <= 1) {
    return showPage('courseSelectionPage', true);
  }

  if (navigationHistory.length > 1) {
    navigationHistory.pop(); // Remove current page
    const prevPage = navigationHistory[navigationHistory.length - 1];
    showPage(prevPage, true); // Go to previous page without adding to history again
  } else {
    // If not logged in and only one page (landingPage), do nothing or go to landingPage.
    showPage('landingPage', true);
  }
}

// Tab switch
function switchAuthTab(tab) {
  console.log('Tab:', tab);
  document.querySelectorAll('.auth-tab-content').forEach(c => c.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  
  document.getElementById(tab + 'Tab').classList.add('active');
  document.querySelector(`[onclick="switchAuthTab('${tab}')"]`).classList.add('active');
}

// Login
async function loginUser() {
  if (window.isAuthProcessing) return;
  const email = document.getElementById('loginIdentifier').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  
  if (!auth) return showToast('Firebase is still loading...', 'error');
  if (!email || !password) return showToast('Fill fields', 'error');
  
  try {
    window.isAuthProcessing = true;
    showToast('Signing in...', 'info');

    const result = await auth.signInWithEmailAndPassword(email, password);
    
    if (!result.user.emailVerified) {
      showToast('Please verify your Gmail first!', 'error');
      if(document.getElementById('verificationNote')) document.getElementById('verificationNote').style.display = 'block';
      await auth.signOut();
      window.isAuthProcessing = false;
      return;
    }

    showToast('Welcome!', 'success');
    document.getElementById('loginIdentifier').value = '';
    document.getElementById('loginPassword').value = '';
    window.location.href = 'index.html';
  } catch (e) {
    showToast(e.message, 'error');
  } finally {
    window.isAuthProcessing = false;
  }
}

// Resend Verification Link (OTP Equivalent)
async function resendVerification() {
  const email = document.getElementById('loginEmail').value.trim(); // Assuming loginEmail is still used for resend
  const password = document.getElementById('loginPassword').value.trim();
  
  if (!email || !password) return showToast('Enter email and password first', 'error');
  
  try {
    showToast('Sending...', 'info');
    const result = await auth.signInWithEmailAndPassword(email, password);
    await result.user.sendEmailVerification();
    await auth.signOut();
    showToast('Verification link resent to your Gmail!', 'success');
    document.getElementById('verificationNote').style.display = 'none';
  } catch (e) {
    showToast(e.message, 'error');
  }
}

// Show Forgot Password prompt
function showForgotPassword() {
  const email = currentUser ? currentUser.email : document.getElementById('loginIdentifier')?.value || '';
  if (!email) {
    showToast('Please enter your email in the login field first.', 'info');
    return;
  }
  if (confirm(`Send password reset link to ${email}?`)) {
    resetPassword(email);
  }
}

// Reset Password
async function resetPassword(email) {
  if (!auth) return showToast('Firebase is still loading...', 'error');
  try {
    showToast('Sending password reset email...', 'info');
    await auth.sendPasswordResetEmail(email);
    showToast('Password reset link sent to your email!', 'success');
  } catch (e) {
    showToast(e.message, 'error');
  }
}

// Signup
async function createAccount() {
  if (window.isAuthProcessing) return;
  const fullName = document.getElementById('signupFullName').value.trim();
  const username = document.getElementById('signupUsername').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const major = document.getElementById('signupMajor').value;
  const gender = document.getElementById('signupGender').value;
  const password = document.getElementById('signupPassword').value.trim();
  const confirmPassword = document.getElementById('signupConfirmPassword').value.trim();
  
  if (!auth) return showToast('Firebase is still loading...', 'error');
  if (!fullName || !username || !email || !major || !gender || !password) return showToast('Fill all fields', 'error');
  if (password.length < 6) return showToast('Password 6+ chars', 'error');
  if (password !== confirmPassword) return showToast('Passwords do not match!', 'error');
  
  try {
    window.isAuthProcessing = true;
    showToast('Creating...', 'info');

    // Check if username already exists
    const usernameSnapshot = await db.collection('users').where('username', '==', username).get();
    if (!usernameSnapshot.empty) {
      showToast('Username already taken. Please choose another.', 'error');
      window.isAuthProcessing = false;
      return;
    }

    const result = await auth.createUserWithEmailAndPassword(email, password);

    // Send the Verification Link (OTP equivalent for security)
    await result.user.sendEmailVerification();

    // Update Firebase Auth profile with the chosen username
    await result.user.updateProfile({ displayName: username });

    // Store additional user data (username, major, gender) in Firestore
    await db.collection('users').doc(result.user.uid).set({
      fullName: fullName,
      username: username,
      email: email,
      major: major,
      gender: gender,
      credits: 100, // Initial credits for new users
      isVIP: false
    }, { merge: true });
    
    showToast('Verification email sent! Check your Gmail before signing in.', 'success');
    await auth.signOut();
  } catch (e) {
    showToast(e.message, 'error');
  } finally {
    window.isAuthProcessing = false;
  }
}

// Course
async function selectCourse(type) {
  if (type === 'specialization') {
    // Handle Majors that have dedicated content
    const majorsWithContent = ['filipino', 'english', 'science', 'tle', 'mathematics'];

    if (currentUser && majorsWithContent.includes(currentUser.major)) {
      showPage('specializationDashboard');
      const majorTitle = currentUser.major.charAt(0).toUpperCase() + currentUser.major.slice(1);
      document.getElementById('specializationTitle').textContent = `🎓 ${majorTitle} Majorship`;
      
      const quizFile = `${currentUser.major}-major-quiz.html`;
      // Update the button inside the specialization dashboard to point to our new file
      const btn = document.querySelector('#specializationDashboard .btn-action');
      if (btn) btn.onclick = () => handleQuizAccess(quizFile, 40);
      return;
    }
    window.location.href = 'specialization-vip.html';
    return;
  }
  currentDashboard = type === 'genEd' ? 'genEdDashboard' : 'profEdDashboard';
  showPage(currentDashboard);
}

// Helper to handle credit deduction for external quiz files
async function handleQuizAccess(url, amount = 20) {
    const success = await deductCredits(amount);
    if (success) {
        showToast(`You used your ${amount} credits for your FlashReview! Good luck!`, "info");
        window.location.href = url;
    } else {
        showToast("Insufficient credits! Please top up.", "error");
        showPage('creditsPlanPage');
    }
}

function purchasePlan(planName) {
    const adminEmail = 'cent5391@gmail.com';
    const subject = encodeURIComponent(`Purchase Inquiry: ${planName} Plan`);
    const body = encodeURIComponent(`Hi Admin, I'm interested in the ${planName} plan.\n\nUser ID: ${currentUser.uid}\nEmail: ${currentUser.email}\n\nPlease send me the G-Cash details.`);
    window.location.href = `mailto:${adminEmail}?subject=${subject}&body=${body}`;
    showToast('Redirecting to Email...', 'info');
}

// Contact Admin
function sendToAdmin() {
  const message = document.getElementById('adminMessage').value.trim();
  if (!message) return showToast('Please enter a message', 'error');

  const adminEmail = 'cent5391@gmail.com';
  const userName = currentUser ? currentUser.name : 'User';
  const subject = encodeURIComponent(`Inquiry from ${userName} - One Take No Retake`);
  const body = encodeURIComponent(message);

  window.location.href = `mailto:${adminEmail}?subject=${subject}&body=${body}`;
  document.getElementById('adminMessage').value = '';
  showToast('Opening your email app...', 'info');
}

function openSettings() {
  navigationHistory.push(currentPage);
  if (currentUser) {
    document.getElementById('displayFullName').value = currentUser.fullName || '';
    document.getElementById('displayUsername').value = currentUser.name || '';
    document.getElementById('displayEmail').value = currentUser.email;
    
    const majorDisplay = document.getElementById('displayMajor');
    if (majorDisplay && currentUser.major) {
        const m = currentUser.major;
        majorDisplay.value = m.charAt(0).toUpperCase() + m.slice(1);
    }

    // Show admin section if user is admin
    const adminSection = document.getElementById('adminSection');
    if (adminSection) {
        adminSection.style.display = currentUser.isAdmin ? 'block' : 'none';
    }
  }
  showPage('accountSettingsPage');
}

async function logout() {
  navigationHistory = ['landingPage'];
  await auth.signOut();
  showToast('Successfully logged out', 'success');
  window.location.href = 'index.html';
}

function openNotifications() {
  navigationHistory.push(currentPage);
  showPage('notificationsPage');
  renderNotifications();
}

async function renderNotifications() {
  const container = document.getElementById('notificationsList');
  if (!container || !currentUser) return;

  try {
    let query = db.collection('notifications').orderBy('createdAt', 'desc');
    
    // Get global notifications and user-specific notifications
    const snapshot = await query.get();
    const notifications = [];

    snapshot.forEach(doc => {
      const data = doc.data();
      // Include if global or if it's for this user
      if (data.isGlobal || data.userId === currentUser.uid) {
        notifications.push({ id: doc.id, ...data });
      }
    });

    if (notifications.length === 0) {
      container.innerHTML = '<div class="empty-notifications">No notifications yet</div>';
      return;
    }

    container.innerHTML = notifications.map(notif => {
      const isRead = notif.readBy && notif.readBy.includes(currentUser.uid);
      const time = notif.createdAt ? new Date(notif.createdAt.toDate()).toLocaleString() : 'Unknown time';
      const sender = notif.isGlobal ? 'System' : 'Admin';
      
      return `
        <div class="notification-item ${isRead ? '' : 'unread'}">
          <div class="notification-content">
            <div class="notification-message">${escapeHtml(notif.message)}</div>
            <div class="notification-meta">
              <span>${sender}</span> • <span class="notification-time">${time}</span> • <span style="opacity: 0.6;">Ref: ${notif.refId || 'N/A'}</span>
            </div>
          </div>
          ${!isRead ? `<button class="btn-mark-read" onclick="markNotificationAsRead('${notif.id}')">Mark Read</button>` : ''}
        </div>
      `;
    }).join('');

    updateNotificationBadge();
  } catch (e) {
    console.error("Error rendering notifications:", e);
    container.innerHTML = '<div class="empty-notifications">Error loading notifications</div>';
  }
}

async function markNotificationAsRead(notificationId) {
  try {
    const notifRef = db.collection('notifications').doc(notificationId);
    const notifDoc = await notifRef.get();
    const data = notifDoc.data();
    const readBy = data.readBy || [];
    
    if (!readBy.includes(currentUser.uid)) {
      readBy.push(currentUser.uid);
      await notifRef.update({ readBy });
      renderNotifications();
    }
  } catch (e) {
    console.error("Error marking notification as read:", e);
  }
}

async function clearAllNotifications() {
  if (!confirm('Are you sure you want to clear all notifications?')) return;

  try {
    let query = db.collection('notifications').orderBy('createdAt', 'desc');
    const snapshot = await query.get();

    const batch = db.batch();
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.isGlobal || data.userId === currentUser.uid) {
        batch.delete(doc.ref);
      }
    });

    await batch.commit();
    renderNotifications();
    showToast('All notifications cleared', 'success');
  } catch (e) {
    console.error("Error clearing notifications:", e);
    showToast('Error clearing notifications', 'error');
  }
}

function updateNotificationBadge() {
  if (!currentUser) return;
  
  db.collection('notifications')
    .orderBy('createdAt', 'desc')
    .get()
    .then(snapshot => {
      let unreadCount = 0;
      snapshot.forEach(doc => {
        const data = doc.data();
        const isForThisUser = data.isGlobal || data.userId === currentUser.uid;
        const isUnread = !data.readBy || !data.readBy.includes(currentUser.uid);
        if (isForThisUser && isUnread) unreadCount++;
      });

      const badge = document.getElementById('notificationBadge');
      if (badge) {
        if (unreadCount > 0) {
          badge.textContent = unreadCount;
          badge.style.display = 'flex';
        } else {
          badge.style.display = 'none';
        }
      }
    })
    .catch(e => console.error("Error updating notification badge:", e));
}

function listenToNotifications() {
  if (!currentUser) return;

  db.collection('notifications')
    .orderBy('createdAt', 'desc')
    .onSnapshot(snapshot => {
      updateNotificationBadge();
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          const data = change.doc.data();
          const isForThisUser = data.isGlobal || data.userId === currentUser.uid;
          if (isForThisUser) {
            showToast(`🔔 New notification: ${data.message.substring(0, 50)}...`, 'info');
          }
        }
      });
    });
}

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Update Profile Info (Saves both Full Name and Username)
async function updateProfileInfo() {
  const newFullName = document.getElementById('displayFullName').value.trim();
  const newUsername = document.getElementById('displayUsername').value.trim();
  
  if (!newFullName) return showToast('Full Name is required', 'error');
  if (!newUsername) return showToast('Username cannot be empty', 'error');
  
  if (newUsername === currentUser.name && newFullName === currentUser.fullName) {
    return showToast('No changes to save', 'info');
  }

  try {
    showToast('Saving changes...', 'info');
    
    // Check if new username is already taken by another user
    const usernameSnapshot = await db.collection('users').where('username', '==', newUsername).get();
    if (!usernameSnapshot.empty && usernameSnapshot.docs[0].id !== currentUser.uid) {
      showToast('Username is already taken!', 'error');
      return;
    }

    // Update Firebase Auth displayName
    await auth.currentUser.updateProfile({ displayName: newUsername });
    
    // Update Firestore
    await db.collection('users').doc(currentUser.uid).update({ 
      fullName: newFullName,
      username: newUsername 
    });

    currentUser.name = newUsername;
    currentUser.fullName = newFullName;

    document.getElementById('userDisplayName').textContent = `👋 ${newUsername}`; // Update UI
    showToast('Profile updated successfully!', 'success');
  } catch (e) {
    console.error("Error updating profile:", e);
    showToast('Failed to update: ' + e.message, 'error');
  }
}

function sendToAdmin() {
  const message = document.getElementById('adminMessage').value.trim();
  if (!message) return showToast('Please enter a message', 'error');

  const adminEmail = 'cent5391@gmail.com';
  const subject = encodeURIComponent(`Issue Report: ${currentUser.name}`);
  const body = encodeURIComponent(`Full Name: ${currentUser.fullName}\nUser ID: ${currentUser.uid}\n\nIssue:\n${message}`);
  
  window.location.href = `mailto:${adminEmail}?subject=${subject}&body=${body}`;
  document.getElementById('adminMessage').value = '';
  showToast('Redirecting to your Email app...', 'info');
}

/**
 * Saves quiz results to Firestore leaderboard collection
 * @param {string} category - 'genEd' or 'profEd'
 * @param {number} score - Number of correct answers
 * @param {number} total - Total questions in the quiz
 */
async function saveQuizResult(category, score, total) {
  if (!currentUser || !db) {
    console.warn('Cannot save score: User not logged in or DB not ready');
    return;
  }

  try {
    const userRef = db.collection('leaderboard').doc(currentUser.uid);
    const data = {
      name: currentUser.name,
      major: currentUser.major,
      lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
    };

    // Use increment to add current score/total to the existing values in Firestore
    data[category] = firebase.firestore.FieldValue.increment(score);
    data[category + '_total'] = firebase.firestore.FieldValue.increment(total);

    await userRef.set(data, { merge: true });
    showToast('Score added to Leaderboard!', 'success');
  } catch (e) {
    console.error("Error saving to Firestore:", e);
  }
}

// Admin Terminal Functions
let terminalOutput; // Defined globally or initialized on DOMContentLoaded
let adminCommandInput; // Defined globally or initialized on DOMContentLoaded

function appendToTerminal(message, type = 'info') {
    if (!terminalOutput) terminalOutput = document.getElementById('terminalOutput');
    if (!terminalOutput) return; // Exit if terminal not found

    const p = document.createElement('p');
    p.textContent = message;
    if (type === 'error') p.style.color = '#f00';
    if (type === 'success') p.style.color = '#0f0';
    if (type === 'warning') p.style.color = '#ff0';
    terminalOutput.appendChild(p);
    terminalOutput.scrollTop = terminalOutput.scrollHeight; // Auto-scroll to bottom
}

async function processAdminCommand() {
    if (!adminCommandInput) adminCommandInput = document.getElementById('adminCommandInput');
    if (!adminCommandInput) return; // Exit if input not found

    const commandString = adminCommandInput.value.trim();
    adminCommandInput.value = ''; // Clear input
    if (!commandString) return;

    appendToTerminal(`> ${commandString}`);

    if (!currentUser || !currentUser.isAdmin) {
        appendToTerminal('Error: You are not authorized to use admin commands.', 'error');
        return;
    }

    const parts = commandString.split(/\s+/); // Split by whitespace
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (command) {
        case '/giveplan':
            await handleGivePlan(args);
            break;
        case '/withdrawplan':
            await handleWithdrawPlan(args);
            break;
        case '/ban':
            await handleBanUser(args);
            break;
        case '/unban':
            await handleUnbanUser(args);
            break;
        case '/noti':
            await handleSendNotification(args);
            break;
        case '/removenoti':
            await handleRemoveNotification(args);
            break;
        case '/removeallnoti':
            await handleRemoveAllNotifications();
            break;
        case '/allfree':
            await handleAllFree();
            break;
        case '/backtonormal':
            await handleBackToNormal();
            break;
        case '/help':
            appendToTerminal('Available commands:');
            appendToTerminal('  /giveplan <username> <plan_number> (1:Starter, 2:Pro, 3:VIP)');
            appendToTerminal('  /withdrawplan <username> <plan_number> (1:Starter, 2:Pro, 3:VIP)');
            appendToTerminal('  /ban <username>');
            appendToTerminal('  /unban <username>');
            appendToTerminal('  /noti (message) - Global notification to all users');
            appendToTerminal('  /noti <username> (message) - Notify specific user');
            appendToTerminal('  /allfree - Grant all users free unlimited access');
            appendToTerminal('  /backtonormal - Return all users to normal credit access');
            appendToTerminal('  /removenoti <ref_id> - Remove a specific notification by its 4-digit reference');
            appendToTerminal('  /removeallnoti - Remove all notifications from the database');
            break;
        default:
            appendToTerminal(`Unknown command: ${command}. Type /help for a list of commands.`, 'warning');
    }
}

async function findUserByUsername(username) {
    try {
        const snapshot = await db.collection('users').where('username', '==', username).limit(1).get();
        if (snapshot.empty) {
            return null;
        }
        return { uid: snapshot.docs[0].id, data: snapshot.docs[0].data() };
    } catch (e) {
        console.error("Error finding user:", e);
        appendToTerminal(`Error finding user ${username}: ${e.message}`, 'error');
        return null;
    }
}

async function handleGivePlan(args) {
    if (args.length !== 2) {
        appendToTerminal('Usage: /giveplan <username> <plan_number>', 'warning');
        return;
    }
    const username = args[0];
    const planNumber = parseInt(args[1]);

    if (isNaN(planNumber) || planNumber < 1 || planNumber > 3) {
        appendToTerminal('Invalid plan number. Use 1, 2, or 3.', 'warning');
        return;
    }

    appendToTerminal(`Searching for user: ${username}...`);
    const user = await findUserByUsername(username);
    if (!user) {
        appendToTerminal(`User '${username}' not found.`, 'error');
        return;
    }

    const userRef = db.collection('users').doc(user.uid);
    let updateData = {};
    let planName = '';

    switch (planNumber) {
        case 1: // Student Starter: 100 credits
            updateData = { credits: 100, isVIP: false };
            planName = 'Student Starter (100 Credits)';
            break;
        case 2: // Reviewer Pro: 220 credits
            updateData = { credits: 220, isVIP: false };
            planName = 'Reviewer Pro (220 Credits)';
            break;
        case 3: // Future LPT VIP: Unlimited credits
            updateData = { isVIP: true, credits: firebase.firestore.FieldValue.delete() }; // Remove credits field if VIP
            planName = 'Future LPT VIP (Unlimited Credits)';
            break;
    }

    try {
        await userRef.update(updateData);
        appendToTerminal(`Successfully gave '${planName}' to user '${username}'.`, 'success');
        // If the admin gives a plan to themselves, update their UI
        if (currentUser && currentUser.uid === user.uid) {
            currentUser.credits = updateData.credits !== undefined ? updateData.credits : currentUser.credits;
            currentUser.isVIP = updateData.isVIP !== undefined ? updateData.isVIP : currentUser.isVIP;
            updateCreditsUI();
        }
    } catch (e) {
        console.error("Error giving plan:", e);
        appendToTerminal(`Error giving plan to '${username}': ${e.message}`, 'error');
    }
}

async function handleWithdrawPlan(args) {
    if (args.length !== 2) {
        appendToTerminal('Usage: /withdrawplan <username> <plan_number>', 'warning');
        return;
    }
    const username = args[0];
    const planNumber = parseInt(args[1]); // Not strictly needed for withdrawal, but for consistency

    if (isNaN(planNumber) || planNumber < 1 || planNumber > 3) {
        appendToTerminal('Invalid plan number. Use 1, 2, or 3.', 'warning');
        return;
    }

    appendToTerminal(`Searching for user: ${username}...`);
    const user = await findUserByUsername(username);
    if (!user) {
        appendToTerminal(`User '${username}' not found.`, 'error');
        return;
    }

    const userRef = db.collection('users').doc(user.uid);
    let updateData = { credits: 0, isVIP: false }; // Default withdrawal to basic state
    let planName = '';

    switch (planNumber) {
        case 1: planName = 'Student Starter'; break;
        case 2: planName = 'Reviewer Pro'; break;
        case 3: planName = 'Future LPT VIP'; break;
    }

    try {
        await userRef.update(updateData);
        appendToTerminal(`Successfully withdrew '${planName}' from user '${username}'. User now has 0 credits and is not VIP.`, 'success');
        // If the admin withdraws a plan from themselves, update their UI
        if (currentUser && currentUser.uid === user.uid) {
            currentUser.credits = 0;
            currentUser.isVIP = false;
            updateCreditsUI();
        }
    } catch (e) {
        console.error("Error withdrawing plan:", e);
        appendToTerminal(`Error withdrawing plan from '${username}': ${e.message}`, 'error');
    }
}

async function handleBanUser(args) {
    if (args.length !== 1) {
        appendToTerminal('Usage: /ban <username>', 'warning');
        return;
    }
    const username = args[0];

    appendToTerminal(`Searching for user: ${username}...`);
    const user = await findUserByUsername(username);
    if (!user) {
        appendToTerminal(`User '${username}' not found.`, 'error');
        return;
    }

    if (user.uid === currentUser.uid) {
        appendToTerminal('Error: You cannot ban yourself.', 'error');
        return;
    }

    try {
        await db.collection('users').doc(user.uid).update({ isBanned: true });
        appendToTerminal(`User '${username}' has been banned.`, 'success');
    } catch (e) {
        console.error("Error banning user:", e);
        appendToTerminal(`Error banning user '${username}': ${e.message}`, 'error');
    }
}

async function handleUnbanUser(args) {
    if (args.length !== 1) {
        appendToTerminal('Usage: /unban <username>', 'warning');
        return;
    }
    const username = args[0];

    appendToTerminal(`Searching for user: ${username}...`);
    const user = await findUserByUsername(username);
    if (!user) {
        appendToTerminal(`User '${username}' not found.`, 'error');
        return;
    }

    try {
        await db.collection('users').doc(user.uid).update({ isBanned: false });
        appendToTerminal(`User '${username}' has been unbanned.`, 'success');
    } catch (e) {
        console.error("Error unbanning user:", e);
        appendToTerminal(`Error unbanning user '${username}': ${e.message}`, 'error');
    }
}

async function handleSendNotification(args) {
    if (args.length === 0) {
        appendToTerminal('Usage: /noti (message) or /noti <username> (message)', 'warning');
        return;
    }

    // Check if first arg is a username (no spaces) or message (has spaces or is quoted)
    const fullMessage = args.join(' ');
    let targetUsername = null;
    let messageText = '';

    // Try to determine if this is targeted or global
    if (args.length >= 2) {
        // Could be: /noti username message text
        const potentialUsername = args[0];
        const potentialMessage = args.slice(1).join(' ');
        
        // Check if potential username exists
        const userExists = await findUserByUsername(potentialUsername);
        if (userExists) {
            targetUsername = potentialUsername;
            messageText = potentialMessage;
        } else {
            // Treat all as message (global)
            messageText = fullMessage;
        }
    } else {
        messageText = fullMessage;
    }

    if (!messageText) {
        appendToTerminal('Error: Message cannot be empty.', 'error');
        return;
    }

    try {
        const refId = Math.floor(1000 + Math.random() * 9000).toString();
        const notificationData = {
            message: messageText,
            createdAt: firebase.firestore.Timestamp.now(),
            readBy: [],
            isGlobal: !targetUsername,
            refId: refId
        };

        if (targetUsername) {
            // Send to specific user
            const user = await findUserByUsername(targetUsername);
            notificationData.userId = user.uid;
            notificationData.username = targetUsername;
            await db.collection('notifications').add(notificationData);
            appendToTerminal(`Notification sent to '${targetUsername}' (Ref: ${refId})`, 'success');
        } else {
            // Send to all users (global)
            await db.collection('notifications').add(notificationData);
            appendToTerminal(`Global notification sent! Ref: ${refId}`, 'success');
        }
    } catch (e) {
        console.error("Error sending notification:", e);
        appendToTerminal(`Error sending notification: ${e.message}`, 'error');
    }
}

async function handleRemoveNotification(args) {
    if (args.length !== 1) {
        appendToTerminal('Usage: /removenoti <ref_id>', 'warning');
        return;
    }
    const refId = args[0];
    try {
        const snapshot = await db.collection('notifications').where('refId', '==', refId).get();
        if (snapshot.empty) {
            appendToTerminal(`No notification found with reference: ${refId}`, 'warning');
            return;
        }
        const batch = db.batch();
        snapshot.forEach(doc => batch.delete(doc.ref));
        await batch.commit();
        appendToTerminal(`Notification ${refId} removed.`, 'success');
    } catch (e) {
        appendToTerminal(`Error: ${e.message}`, 'error');
    }
}

async function handleRemoveAllNotifications() {
    if (!confirm('Are you sure you want to delete ALL notifications?')) return;
    try {
        const snapshot = await db.collection('notifications').get();
        const batch = db.batch();
        snapshot.forEach(doc => batch.delete(doc.ref));
        await batch.commit();
        appendToTerminal('All notifications have been cleared.', 'success');
    } catch (e) {
        appendToTerminal(`Error: ${e.message}`, 'error');
    }
}

async function handleAllFree() {
    try {
        const globalSettingsRef = db.collection('settings').doc('global');
        await globalSettingsRef.set({ allFreeMode: true }, { merge: true });
        window.allFreeMode = true; // Update client-side flag immediately
        appendToTerminal('All users now have FREE unlimited access!', 'success');
        // Force a re-render of UI elements that depend on allFreeMode
        if (currentUser) {
            currentUser.isVIP = true;
            currentUser.credits = Infinity;
            updateCreditsUI();
        }
    } catch (e) {
        appendToTerminal(`Error enabling all-free mode: ${e.message}`, 'error');
    }
}

async function handleBackToNormal() {
    try {
        const globalSettingsRef = db.collection('settings').doc('global');
        await globalSettingsRef.set({ allFreeMode: false }, { merge: true });
        window.allFreeMode = false; // Update client-side flag immediately
        appendToTerminal('All users returned to normal credit access.', 'success');
        // Force a re-render of UI elements that depend on allFreeMode
        // This will cause onAuthChanged to re-evaluate and use actual user data
        if (currentUser) {
            // Re-fetch user data to get original VIP/credits status
            const userDoc = await db.collection('users').doc(currentUser.uid).get();
            if (userDoc.exists) {
                const userData = userDoc.data();
                currentUser.isVIP = userData.isVIP || false;
                currentUser.credits = userData.credits;
            } else {
                // Fallback if user doc somehow disappeared (shouldn't happen)
                currentUser.isVIP = false;
                currentUser.credits = 0;
            }
            updateCreditsUI();
        }
    } catch (e) {
        appendToTerminal(`Error disabling all-free mode: ${e.message}`, 'error');
    }
}

// Removed: allLeaderboardUsers is no longer needed for "Coming Soon" leaderboard
/**
 * Fetches and displays the global rankings, summing up scores from all subjects
 */
async function openLeaderboard() {
  showPage('leaderboardPage');
  fetchAndRenderLeaderboard();
}

async function fetchAndRenderLeaderboard() {
  const container = document.getElementById('leaderboardList');
  if (!container) return;
  container.innerHTML = `
    <div style="padding: 60px 20px; text-align: center; color: var(--text-muted);">
      <i class="fas fa-tools" style="font-size: 3.5rem; margin-bottom: 25px; color: var(--primary); opacity: 0.8;"></i>
      <h2 style="color: white; margin-bottom: 15px;">Ranking System Coming Soon!</h2>
      <p style="max-width: 500px; margin: 0 auto; line-height: 1.6;">We are currently refining the Global Leaderboard to provide more accurate performance insights. Stay tuned to see where you stand among thousands of future LPTs!</p>
    </div>
  `;
}

function showToast(msg, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = `toast active toast-${type}`;
  setTimeout(() => toast.classList.remove('active'), 5000);
}

// Init
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    initFirebase();

    // Initialize terminal elements
    terminalOutput = document.getElementById('terminalOutput');
    adminCommandInput = document.getElementById('adminCommandInput');
    if (adminCommandInput) {
        adminCommandInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') processAdminCommand();
        });
    }

    console.log('✅ Ready! Enable Email/Password');
  });
}
