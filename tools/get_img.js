const axios = require('axios');
const fs = require('fs');
const path = require('path');
/**
 * Downloads an image from the given URL and returns it as a base64 string with data URL prefix.
 * @returns {Promise<string>} Base64 encoded image with data URL prefix
 */
async function getImageBase64() {
    const randomNum = Math.floor(Math.random() * 15) + 1;
    // Use remote image, no local file read
    const url = `https://raw.githubusercontent.com/ArezDev/usa_new_img/refs/heads/main/a%20(${randomNum}).jpg`;
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const base64 = Buffer.from(response.data, 'binary').toString('base64');
    // Use image/jpeg since the file is .jpg
    return `data:image/jpeg;base64,${base64}`;
}

async function getCoverImageBase64() {
    const randomNum = Math.floor(Math.random() * 15) + 1;
    const url = `https://raw.githubusercontent.com/ArezDev/foto-sampul/refs/heads/main/s%20(${randomNum}).jpg`;
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const base64 = Buffer.from(response.data, 'binary').toString('base64');
    // Use image/jpeg since the file is .jpg
    return `data:image/jpeg;base64,${base64}`;
}

async function getImageFromFIle() {
    const randomNum = Math.floor(Math.random() * 101) + 1;
    //const imagePath = `${path.dirname()}/img/a (${randomNum}).jpg`;
    const imagePath = path.join(__dirname, '..', 'img', `a (${randomNum}).jpg`);
    const imageBuffer = fs.readFileSync(imagePath);
    const base64 = imageBuffer.toString('base64');
    return `data:image/jpeg;base64,${base64}`;
}

module.exports = { getImageBase64, getCoverImageBase64, getImageFromFIle };