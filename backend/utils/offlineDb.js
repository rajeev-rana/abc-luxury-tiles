const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, '..', 'data');

// Ensure directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const getFilePath = (collection) => path.join(DATA_DIR, `${collection}.json`);

const readData = (collection) => {
  const filePath = getFilePath(collection);
  if (!fs.existsSync(filePath)) {
    // If files don't exist, initialize and seed
    const initialData = seedData(collection);
    writeData(collection, initialData);
    return initialData;
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading database file: ${filePath}`, err);
    return [];
  }
};

const writeData = (collection, data) => {
  const filePath = getFilePath(collection);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error(`Error writing database file: ${filePath}`, err);
  }
};

const seedData = (collection) => {
  if (collection === 'users') {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync('password', salt);
    
    return [
      {
        _id: 'usr-admin-1',
        name: 'Rajeev Rana (Owner)',
        email: 'admin@test.com',
        password: hashedPassword,
        role: 'admin',
        phone: '+91 98765 43210',
        companyName: 'ABC Tiles & Ceramics Premium Store',
        gstin: '27AAAAA1111A1Z1',
        loyaltyPoints: 340,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: 'usr-dealer-1',
        name: 'Trade Dealer',
        email: 'dealer@test.com',
        password: hashedPassword,
        role: 'dealer',
        phone: '+91 99999 88888',
        companyName: 'Rana & Partners Design',
        gstin: '27BBBBB2222B2Z2',
        loyaltyPoints: 120,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: 'usr-client-1',
        name: 'John Doe',
        email: 'user@test.com',
        password: hashedPassword,
        role: 'user',
        phone: '+91 98888 77777',
        companyName: '',
        gstin: '',
        loyaltyPoints: 20,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }

  if (collection === 'inquiries') {
    return [
      {
        _id: 'inq-1',
        name: 'Rajesh K.',
        email: 'rajesh@builders.com',
        phone: '+91 99887 76655',
        businessType: 'Builder',
        companyName: 'RK Builders & Developers',
        city: 'Mumbai',
        message: 'Looking for 5000 sq ft vitrified tiles for upcoming high-rise project.',
        status: 'Pending',
        createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 3600000).toISOString()
      },
      {
        _id: 'inq-2',
        name: 'Ananya S.',
        email: 'ananya@studiodesign.in',
        phone: '+91 91234 56789',
        businessType: 'Interior Designer',
        companyName: 'Ananya Studio Design',
        city: 'Pune',
        message: 'Requesting catalog and samples of PVD gold finished luxury bath tiles.',
        status: 'Contacted',
        createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
        updatedAt: new Date(Date.now() - 24 * 3600000).toISOString()
      },
      {
        _id: 'inq-3',
        name: 'Vikram R.',
        email: 'vikram@stoneimporters.com',
        phone: '+91 98765 00011',
        businessType: 'Distributor',
        companyName: 'Vikram Stone Imports',
        city: 'Delhi',
        message: 'Interested in becoming official regional distributor for northern region.',
        status: 'Approved',
        createdAt: new Date(Date.now() - 48 * 3600000).toISOString(),
        updatedAt: new Date(Date.now() - 48 * 3600000).toISOString()
      }
    ];
  }

  return [];
};

module.exports = {
  // Find all items
  find: (collection, query = {}) => {
    const list = readData(collection);
    return list.filter(item => {
      for (const key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    });
  },

  // Find single item
  findOne: (collection, query = {}) => {
    const list = readData(collection);
    return list.find(item => {
      for (const key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    });
  },

  // Find item by ID
  findById: (collection, id) => {
    const list = readData(collection);
    return list.find(item => item._id === id);
  },

  // Save new item
  insert: (collection, doc) => {
    const list = readData(collection);
    const newDoc = {
      _id: `${collection.slice(0, 3)}-${Date.now()}`,
      ...doc,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    list.push(newDoc);
    writeData(collection, list);
    return newDoc;
  },

  // Update item by ID
  findByIdAndUpdate: (collection, id, updateObj, options = { new: true }) => {
    const list = readData(collection);
    const index = list.findIndex(item => item._id === id);
    if (index === -1) return null;

    const updatedItem = {
      ...list[index],
      ...(updateObj.$set || updateObj),
      updatedAt: new Date().toISOString()
    };

    list[index] = updatedItem;
    writeData(collection, list);
    return updatedItem;
  },

  // Delete item by ID
  findByIdAndDelete: (collection, id) => {
    let list = readData(collection);
    const item = list.find(item => item._id === id);
    if (!item) return null;
    list = list.filter(item => item._id !== id);
    writeData(collection, list);
    return item;
  }
};
