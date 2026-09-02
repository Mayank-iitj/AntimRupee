// 100 Realistic Block/District names
const blocks = [
  "LUCKNOW-S", "GORAKHPUR-N", "VARANASI-C", "KANPUR-W", "AGRA-E", "PRAYAGRAJ-1", "BAREILLY-2", "ALIGARH-S",
  "MORADABAD-N", "SAHARANPUR", "GHAZIABAD", "NOIDA-SEC62", "MEERUT-C", "AYODHYA-1", "JHANSI-2", "MATHURA",
  "FIROZABAD", "MUZAFFARNAGAR", "RAMPUR", "SHAHJAHANPUR", "FARRUKHABAD", "HAPUR", "ETAWAH", "MIRZAPUR",
  "BULANDSHAHR", "SAMBHAL", "AMROHA", "HARDOI", "FATEHPUR", "RAEBARELI", "ORAI", "GONDA", "JAUNPUR",
  "SITAPUR", "UNNAO", "BANDA", "LAKHIMPUR", "HATHRAS", "LALITPUR", "DEORIA", "GHAZIPUR", "MAINPURI",
  "BUDAUN", "PILIBHIT", "BAHRAICH", "AZAMGARH", "BASTI", "MAU", "BALLIA", "SULTANPUR", "CHANDAULI",
  "SONBHADRA", "BHADOHI", "KUSHINAGAR", "SIDDHARTHNAGAR", "MAHARAJGANJ", "BALRAMPUR", "SHRAVASTI",
  "KANNAUJ", "AURAIYA", "KANPUR_DEHAT", "JALAUN", "MAHOBA", "HAMIRPUR", "CHITRAKOOT", "FATEHPUR_S",
  "PRATAPGARH", "KAUSHAMBI", "ALLAHABAD_R", "BARABANKI", "AMETHI", "AMBEDKAR_NAGAR", "BAHRAICH_N",
  "GONDA_S", "BALRAMPUR_W", "BASTI_E", "SANT_KABIR", "MAHARAJGANJ_S", "KUSHINAGAR_N", "DEORIA_S",
  "AZAMGARH_W", "MAU_S", "BALLIA_N", "GHAZIPUR_W", "VARANASI_S", "CHANDAULI_N", "MIRZAPUR_E",
  "SONBHADRA_W", "BHADOHI_N", "SANT_RAVIDAS", "AGRA_N", "MATHURA_S", "FIROZABAD_E", "MAINPURI_W",
  "ETAWAH_N", "AURAIYA_S", "KANPUR_N", "KANPUR_S", "LUCKNOW_E", "LUCKNOW_W"
];

export const mockBlocks = blocks.map((b, i) => ({
  block_id: b,
  c: Math.floor(Math.random() * 1500) + 100 // 100 to 1600
})).sort((a, b) => b.c - a.c); // sort descending

export const mockCauses = [
  { cause_code: 'Account Frozen', count: 8400 },
  { cause_code: 'Name Mismatch', count: 6200 },
  { cause_code: 'Dormant Account', count: 5100 },
  { cause_code: 'Invalid IFSC', count: 4300 },
  { cause_code: 'Aadhaar Not Linked', count: 3200 },
  { cause_code: 'KYC Expired', count: 2800 },
  { cause_code: 'Account Closed', count: 2100 },
  { cause_code: 'Limit Exceeded', count: 1500 },
  { cause_code: 'Auth Timeout', count: 1200 },
  { cause_code: 'NPCI Map Fail', count: 950 },
  { cause_code: 'Invalid Acc No', count: 800 },
  { cause_code: 'DBT Not Enabled', count: 650 },
  { cause_code: 'Network Error', count: 500 },
  { cause_code: 'Signature Fail', count: 420 },
  { cause_code: 'Duplicate Txn', count: 310 },
  { cause_code: 'Invalid Amount', count: 200 }
];

const bankNames = ["SBI", "PNB", "BOB", "HDFC", "ICICI", "Axis Bank", "Union Bank", "Canara Bank", "Bank of India", "Indian Bank"];
const branches = ["Civil Lines", "Gomti Nagar", "Cantt", "Aminabad", "Chowk", "Indira Nagar", "Aliganj", "Hazratganj", "Mahanagar", "Kapoorthala"];
const errorTypes = ['ERR_ACCT_FROZEN', 'NAME_MISMATCH', 'INVALID_IFSC', 'AADHAAR_UNLINKED', 'KYC_EXPIRED', 'DBT_DISABLED', 'DORMANT_ACCT'];

export const mockWorklist = Array.from({ length: 100 }).map((_, i) => {
  const bank = bankNames[Math.floor(Math.random() * bankNames.length)];
  const branch = branches[Math.floor(Math.random() * branches.length)];
  const cause = errorTypes[Math.floor(Math.random() * errorTypes.length)];
  const priority = 0.5 + Math.random() * 0.49; // 0.5 to 0.99
  const workers = Math.floor(Math.random() * 200) + 10;
  
  return {
    cluster_id: `C-${(i+1).toString().padStart(3, '0')}`,
    dimension_value: `${bank} - ${branch}`,
    priority: priority,
    workers_affected: workers,
    unpaid_total: workers * (Math.floor(Math.random() * 5000) + 1000), // Random avg wage
    mean_days_pending: Math.floor(Math.random() * 60) + 5,
    cause_code: cause,
    group_rate: Math.random() * 0.4 + 0.5,
    baseline_rate: Math.random() * 0.1
  };
}).sort((a, b) => b.priority - a.priority); // sort highest priority first

export const generateMockWorker = (workerId) => {
  const firstNames = ["Ram", "Shyam", "Sita", "Gita", "Rahul", "Priya", "Amit", "Neha", "Mohan", "Radha"];
  const lastNames = ["Singh", "Kumar", "Devi", "Yadav", "Sharma", "Verma", "Gupta", "Mishra"];
  const first = firstNames[Math.floor(Math.random() * firstNames.length)];
  const last = lastNames[Math.floor(Math.random() * lastNames.length)];
  
  return {
    worker: {
      worker_id: workerId || `W_${Math.floor(Math.random()*90000)+10000}_UP`,
      jobcard_id: `UP-${Math.floor(Math.random()*99)}-04-001-${Math.floor(Math.random()*999)}`,
      name_local: `${first} ${last}`,
      name_bank: `${first.toUpperCase()} ${last.toUpperCase()}`
    },
    trace: `[2026-08-25 10:14:02] INITIALIZING DBT TRANSFER\n[2026-08-25 10:14:03] FETCHING UIDAI TOKEN... OK\n[2026-08-25 10:14:05] NPCI ROUTING TO DESTINATION BANK\n[2026-08-25 10:14:06] BANK SYSTEM RESPONSE: REJ_CD_55\n[2026-08-25 10:14:06] FATAL: ERR_CD_99_ACCT_FRZ_KYC_FAIL\n[2026-08-25 10:14:06] TRANSACTION REVERTED`
  };
};
