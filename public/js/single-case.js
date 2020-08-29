const urlParams = new URLSearchParams(window.location.search);
const legalCase = urlParams.get("case");

async function getCase() {
	const caseData = await fetch(`/api?case=${legalCase}`);
	
	const { data } = await caseData.json();

	if(data.caseCitation) return data.caseCitation.case;

	return "Case Not Found";
}


document.addEventListener("adobe_dc_view_sdk.ready", async function () {
	if (legalCase) {
		document.getElementById("has-case").classList.remove("hidden");
		document.getElementById("case-body").classList.remove("hidden");

		const caseData = await getCase();

		const { id, caseName, legislationToCases, casesCitedsByCaseCited, casesCitedsByCaseOrigin } = caseData
		
		document.getElementById("has-case").innerHTML = caseName;

		if(casesCitedsByCaseCited.length !== 0) {
			const citedBy = casesCitedsByCaseCited.map(({caseByCaseOrigin}) => `<li><a href="/single-case.html?case=${caseByCaseOrigin.caseCitations[0].id}">${caseByCaseOrigin.caseName}</a></li>`)
			document.getElementById("citedBy").innerHTML = citedBy.join('');
		}

		if(casesCitedsByCaseOrigin.length !== 0) {
			const cites = casesCitedsByCaseOrigin.map(({caseByCaseCited}) => `<li><a href="/single-case.html?case=${caseByCaseCited.caseCitations[0].id}">${caseByCaseCited.caseName}</a></li>`)
			document.getElementById("cites").innerHTML = cites.join('');
		}
		if(legislationToCases.length !== 0) {
			const legislationLinks = legislationToCases.map(({legislation, section}) => `<li><a href="http://legislation.govt.nz${legislation.link}">${legislation.title}, ${section}</a></li>`)
			document.getElementById("legislation").innerHTML = legislationLinks.join('');
		}

		var adobeDCView = new AdobeDC.View({
			clientId: "1639f22871dc4d1891119d8833bf473b",
			divId: "adobe-dc-view",
		});
		adobeDCView.previewFile(
			{
				content: {
					location: {
						url: `https://openlawnz-pdfs-dev.s3-ap-southeast-2.amazonaws.com/${id}`,
					},
				},
				metaData: { fileName: `${id}` },
			},
			{ embedMode: "IN_LINE" }
		);
	} else {
		document.getElementById("no-case").classList.remove("hidden");
	}
});
