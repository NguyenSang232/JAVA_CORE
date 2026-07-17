
const BASE_URL = "http://localhost:8081";
const API = {
    owners: `${BASE_URL}/api/owners`,
    pets: `${BASE_URL}/api/pets`,
    users: `${BASE_URL}/api/users`,
    boarding: `${BASE_URL}/api/boarding-records`,
    careNotes: `${BASE_URL}/api/care-notes`
};
/* =====================================================
   GLOBAL DATA
===================================================== */
let owners = [];
let pets = [];
let users = [];
let boardings = [];
let careNotes = [];
/* =====================================================
   PET PAGE
===================================================== */
let currentPetPage = 1;
const PETS_PER_PAGE = 5;
let currentPetFilter = "ALL";
let currentPetSort = "ASC";
let currentPetKeyword = "";
/* =====================================================
   OWNER PAGE
===================================================== */
let currentOwnerPage = 1;
const OWNERS_PER_PAGE = 5;
let currentOwnerKeyword = "";
/* =====================================================
   BOARDING PAGE
===================================================== */
let currentBoardingPage = 1;
const BOARDING_PER_PAGE = 5;
let currentBoardingStatus = "ALL";
/* =====================================================
   REPORT
===================================================== */
let revenueChart = null;