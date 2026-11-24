import { BarangayFeature, EvacuationCenter } from "../types";


export const BUTUAN_CENTER: [number, number] = [8.95349978920977, 125.52923262421898]; // Butuan City Hall

export const AGUSAN_RIVER_LINE: [number, number][] = [
  [9.0202513, 125.5074548],
  [9.0080916, 125.5245359],
  [8.9938778, 125.5293039],
  [8.9884835, 125.5290437],
  [8.9799217, 125.5268763],
  [8.9761555, 125.5286098],
  [8.9674231, 125.542391],
  [8.9544071, 125.5436908],
  [8.9477275, 125.5463781],
  [8.9441982, 125.5467384],
  [8.9414956, 125.5436648],
  [8.9382258, 125.5448131],
  [8.9359569, 125.5481232],
  [8.9328205, 125.5508253],
  [8.9157259, 125.5549198],
  [8.9102725, 125.5570846],
  [8.9013436, 125.5573551],
  [8.8925302, 125.5539706]
];

export const BUTUAN_BARANGAYS: BarangayFeature[] = [
  {
    id: "brgy-banza",
    name: "Barangay Banza",
    riskLevel: "High",
    population: 6420,
    households: 1410,
    coordinates: [8.973188900448655, 125.53847482718113],
    hazardDescription: "Directly adjacent to Agusan River bend; prone to rapid riverbank overflow and severe flash floods during typhoons.",
    elevationMeters: 4.2
  },
  {
    id: "brgy-dagohoy",
    name: "Baan Riverside Pob. (Bgy. 20)", 
    riskLevel: "High",
    population: 5120,
    households: 1150,
    coordinates: [8.953266515979875, 125.5475998520157],
    hazardDescription: "Low-lying urban commercial core susceptible to backwater flooding from Agusan River during high tide and heavy rains.",
    elevationMeters: 3.5
  },
  {
    id: "brgy-maibu",
    name: "Barangay Pagatpatan",
    riskLevel: "Medium",
    population: 3890,
    households: 820,
    coordinates: [8.992292582203504, 125.52628208839411],
    hazardDescription: "Prone to localized inundation from inland agricultural runoff and secondary tributary swells.",
    elevationMeters: 8.1
  },
  {
    id: "brgy-lumbocan",
    name: "Barangay Lumbocan",
    riskLevel: "High",
    population: 8930,
    households: 1980,
    coordinates: [9.009665290761701, 125.50303179399714],
    hazardDescription: "Coastal-estuarine zone vulnerable to storm surges, tidal flooding, and Agusan River flood peaks.",
    elevationMeters: 2.1
  },
  {
    id: "brgy-agusan-pequeño",
    name: "Barangay Agusan Pequeño",
    riskLevel: "Medium",
    population: 7450,
    households: 1620,
    coordinates: [8.980644169002325, 125.52200160605024],
    hazardDescription: "Agricultural flood plain areas with slow drainage during prolonged monsoons.",
    elevationMeters: 9.4
  },
  {
    id: "brgy-doongan",
    name: "Barangay Bading",
    riskLevel: "High",
    population: 12400,
    households: 2890,
    coordinates: [8.96944845168933, 125.534562107987],
    hazardDescription: "Dense settlement area with high vulnerability due to poor natural drainage into the river channel.",
    elevationMeters: 3.8
  },
  {
    id: "brgy-golden-ribbon",
    name: "Barangay Golden Ribbon",
    riskLevel: "High",
    population: 4680,
    households: 1040,
    coordinates: [8.939426930022762, 125.54146277648239],
    hazardDescription: "Low-elevation riverside community experiencing frequent inundation during alert level 2 floods.",
    elevationMeters: 3.9
  },
  {
    id: "brgy-imadejas",
    name: "Barangay Maon",
    riskLevel: "Medium",
    population: 6810,
    households: 1530,
    coordinates: [8.931847089387382, 125.54465479814994],
    hazardDescription: "Moderate risk zone with localized flash floods from urban drainage bottlenecks.",
    elevationMeters: 6.5
  },
  {
    id: "brgy-langasan",
    name: "Barangay San Vicente",
    riskLevel: "Low",
    population: 4210,
    households: 910,
    coordinates: [8.90524949747347, 125.54799391139561],
    hazardDescription: "Elevated terrain with minimal flood risk except during extreme catastrophic storm events.",
    elevationMeters: 18.0
  }
];

export const EVACUATION_CENTERS: EvacuationCenter[] = [
  {
    id: "ec-1",
    name: "Butuan City Sports Complex & Gymnasium",
    barangay: "Imadejas",
    address: "Perez St, Butuan City, Agusan del Norte",
    capacity: 3500,
    currentOccupancy: 320,
    contactPerson: "Dir. Rogelio M. Santos",
    contactNumber: "+63 85 341 2291",
    coordinates: [8.942077512172148, 125.50785314528405],
    facilities: ["Medical Station", "Backup Generator", "Potable Water Tank", "Kitchen Hall", "Wi-Fi Hotspot"],
    status: "Open"
  },
  {
    id: "ec-2",
    name: "Father Saturnino Urios University Gymnasium",
    barangay: "Dagohoy",
    address: "San Francisco St, Butuan City",
    capacity: 2000,
    currentOccupancy: 0,
    contactPerson: "Fr. Mark Anthony Tan",
    contactNumber: "+63 85 342 1812",
    coordinates: [8.947232466161712, 125.54162448649501],
    facilities: ["Multi-story Concrete Shelter", "Clinic", "Sanitation Facilities", "Generator"],
    status: "Open"
  },
  {
    id: "ec-3",
    name: "Doongan Covered Court",
    barangay: "Doongan",
    address: "Doongan Road, Butuan City",
    capacity: 1800,
    currentOccupancy: 1450,
    contactPerson: "Principal Elena C. Vanguardia",
    contactNumber: "+63 85 343 5520",
    coordinates: [8.958965036979095, 125.52407436270481],
    facilities: ["Covered Basketball Court", "First Aid Station", "Communal Kitchen", "Restrooms"],
    status: "Near Capacity"
  },
  {
    id: "ec-4",
    name: "Baan Central Elementary School Multipurpose Center",
    barangay: "Baan",
    address: "Baan Riverside, Butuan City",
    capacity: 1200,
    currentOccupancy: 1200,
    contactPerson: "Head Teacher Nestor P. Alcantara",
    contactNumber: "+63 85 345 9011",
    coordinates: [8.95936802369854, 125.56115102133501],
    facilities: ["Elevated Classrooms", "Deep Well Water System", "Storage Depot"],
    status: "Full"
  },
  {
    id: "ec-5",
    name: "Lumbocan Barangay Gymnasium",
    barangay: "Lumbocan",
    address: "National Highway, Lumbocan, Butuan City",
    capacity: 1500,
    currentOccupancy: 410,
    contactPerson: "Punong Barangay Joselito Curato",
    contactNumber: "+63 85 346 7788",
    coordinates: [9.00958633038806, 125.50303247208603],
    facilities: ["Typhoon-Resilient Roof", "Emergency Medical Post", "Solar Power Setup"],
    status: "Open"
  },
  {
    id: "ec-6",
    name: "Agusan Pequeño Community Assembly Hall",
    barangay: "Agusan Pequeño",
    address: "Purok 4, Agusan Pequeño, Butuan City",
    capacity: 900,
    currentOccupancy: 0,
    contactPerson: "Barangay Sec. Maria Luisa Perez",
    contactNumber: "+63 85 347 2233",
    coordinates: [8.975601832235158, 125.526719764225],
    facilities: ["Storage Units", "Rainwater Harvesting", "Radio Communications Base"],
    status: "Standby"
  }
];
