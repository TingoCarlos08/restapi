const admin = require('firebase-admin');
const db = admin.firestore();

/**
 * @swagger
 * tags:
 *   name: Items
 *   description: Operations about items
 */

/**
 * @swagger
 * /api/items/{id}:
 *   get:
 *     summary: Get an item by ID
 *     tags: [Items]
 *     description: Get an item entry
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Item ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Get an item by ID
 *       404:
 *         description: Item not found
 *       400:
 *         description: Bad request
 */
exports.getItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const itemDoc = await db.collection('items').doc(itemId).get();
    if (!itemDoc.exists) {
      res.status(404).send('Item not found');
    } else {
      res.status(200).json({ id: itemDoc.id, ...itemDoc.data() });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

/**
 * @swagger
 * /api/items:
 *   get:
 *     summary: Get all items
 *     tags: [Items]
 *     description: Get all items entries
 *     responses:
 *       200:
 *         description: Items entries successfully obtained
 *       400:
 *         description: Bad request
 */
exports.getAllItems = async (req, res) => {
  try {
    const itemsSnapshot = await db.collection('items').get();
    const items = [];
    itemsSnapshot.forEach((doc) => items.push({ id: doc.id, ...doc.data() }));
    res.status(200).json(items);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

/**
 * @swagger
 * /api/items:
 *   post:
 *     summary: Create an item
 *     tags: [Items]
 *     description: Create an item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               // Define your properties here based on what 'data' contains
 *     responses:
 *       201:
 *         description: Item successfully created
 *       400:
 *         description: Bad request
 */
exports.createItem = async (req, res) => {
  try {
    const data = req.body;
    const itemRef = await db.collection('items').add(data);
    res.status(201).send(`Created a new item: ${itemRef.id}`);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

/**
 * @swagger
 * /api/items/{id}:
 *   put:
 *     summary: Update an item by ID
 *     tags: [Items]
 *     description: Update an item
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Item ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               // Define your properties here based on what 'data' contains
 *     responses:
 *       200:
 *         description: Item updated
 *       400:
 *         description: Bad request
 */
exports.updateItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const data = req.body;
    const itemRef = db.collection('items').doc(itemId);
    await itemRef.update(data);
    res.status(200).send('Item updated');
  } catch (error) {
    res.status(400).send(error.message);
  }
};

/**
 * @swagger
 * /api/items/{id}:
 *   delete:
 *     summary: Delete an item by ID
 *     tags: [Items]
 *     description: Delete an item
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Item ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item deleted
 *       400:
 *         description: Bad request
 */
exports.deleteItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    await db.collection('items').doc(itemId).delete();
    res.status(200).send('Item deleted');
  } catch (error) {
    res.status(400).send(error.message);
  }
};
