
const BASE_URL = "http://localhost:8081";
const API = {
    owners: `${BASE_URL}/api/owners`,
    pets: `${BASE_URL}/api/pets`,
    users: `${BASE_URL}/api/users`,
    boarding: `${BASE_URL}/api/boarding-records`,
    careNotes: `${BASE_URL}/api/care-notes`,
	prices: `${BASE_URL}/api/prices`
};

let owners = [];
let pets = [];
let users = [];
let boardings = [];
let careNotes = [];
let prices = [];

let currentPetPage = 1;
const PETS_PER_PAGE = 5;
let currentPetFilter = "ALL";
let currentPetSort = "ASC";
let currentPetKeyword = "";
let currentBoardingKeyword = ""

let currentOwnerPage = 1;
const OWNERS_PER_PAGE = 5;
let currentOwnerKeyword = "";

let currentBoardingPage = 1;
const BOARDING_PER_PAGE = 5;
let currentBoardingStatus = "ALL";

let revenueChart = null;