const axios = require("axios");
const fs = require("fs").promises;
const fsOriginal = require("fs");
const path = require("path");
const extract = require("extract-zip");

const states = [
	"Alabama",
	// "Alaska",
	// "Arizona",
	// "Arkansas",
	// "California",
	// "Colorado",
	// "Connecticut",
	// "Delaware",
	// "DistrictofColumbia",
	// "Florida",
	// "Georgia",
	// "Hawaii",
	// "Idaho",
	// "Illinois",
	// "Indiana",
	// "Iowa",
	// "Kansas",
	// "Kentucky",
	// "Louisiana",
	// "Maine",
	// "Maryland",
	// "Massachusetts",
	// "Michigan",
	// "Minnesota",
	// "Mississippi",
	// "Missouri",
	// "Montana",
	// "Nebraska",
	// "Nevada",
	// "NewHampshire",
	// "NewJersey",
	// "NewMexico",
	// "NewYork",
	// "NorthCarolina",
	// "NorthDakota",
	// "Ohio",
	// "Oklahoma",
	// "Oregon",
	// "Pennsylvania",
	// "RhodeIsland",
	// "SouthCarolina",
	// "SouthDakota",
	// "Tennessee",
	// "Texas",
	// "Utah",
	// "Vermont",
	// "Virginia",
	// "Washington",
	// "WestVirginia",
	// "Wisconsin",
	// "Wyoming"
];

(async () => {
	await Promise.all(states.map((state) => {
		return new Promise(async (resolve, reject) => {
			const url = `https://usbuildingdata.blob.core.windows.net/usbuildings-v2/${state}.geojson.zip`;

			const dataStream = await axios.request({
				"responseType": "stream",
				url,
				"method": "get",
				"headers": {
					'accept-encoding': 'gzip,deflate'
				}
			});

			const dataDirectory = path.join(__dirname, "..", "data");
			const zipFilePath = path.join(dataDirectory, `${state}.geojson.zip`);

			const writeStreamZip = fsOriginal.createWriteStream(zipFilePath);

			dataStream.data.pipe(writeStreamZip).on("finish", async (err) => {
				if (err) {
					return reject(err);
				} else {
					await extract(zipFilePath, { "dir": dataDirectory });
					await fs.rm(zipFilePath);
					resolve();
				}
			});
		});
	}));
})();
