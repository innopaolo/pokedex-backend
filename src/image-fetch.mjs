import fetch from 'node-fetch';
import db from './db.mjs';

// Define the GitHub repository and folder information
const owner = 'fanzeyi'; 
const repo = 'pokemon.json'; 
const folderPaths = [
    'sprites',
    'thumbnails',
    'images'
]

async function fetchImageUrls(folderPath) {
    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${folderPath}`);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
  
      // Filter the list to include only files and get its 'raw' link
      const imageUrls = data
        .filter(item => item.type === 'file')
        .map(item => item.download_url);
  
      return imageUrls;
    } catch (error) {
      console.error(`Error fetching image URLs from ${folderPath}:`, error);
      return [];
    }
}
  
  // Fetch links from multiple folders in parallel with Promise.all
  async function fetchLinksAndUpdateDatabase() {
    try {
        const promises = folderPaths.map(folderPath => fetchImageUrls(folderPath));
        const allImageUrls = await Promise.all(promises);
        
        // Separate image links to each variable
        const spriteUrls = allImageUrls[0];
        const thumbnailUrls = allImageUrls[1];
        const imageUrls = allImageUrls[2];

        // Loop through the links arrays and update the corresponding rows
        for (let i = 0; i < spriteUrls.length; i++) {
            const spriteUrl = spriteUrls[i];
            const thumbnailUrl = thumbnailUrls[i];
            const imageUrl = imageUrls[i];
            
            // UPDATE statement for the database
            const updateQuery = `
                UPDATE pokemon
                SET sprite = ?,
                    thumbnail = ?,
                    image = ?
                WHERE id = ?;`;

            db.run(updateQuery, [spriteUrl, thumbnailUrl, imageUrl, i + 1], (err) => {
                if (err) {
                console.error('Error updating row:', err);
                } else {
                console.log('Row updated successfully');
                }
            });
      }

    } catch (error) {
      console.error('Error fetching image URLs:', error);
    }
}


// export default fetchImagesAndAssociate;
export default fetchLinksAndUpdateDatabase;
