const generateForm = document.querySelector('.generate-form');
const imageGallery = document.querySelector('.image-gallery');

const OPENAI_API_KEY = "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";

const updateImageCard = (imgDataArray) => {
    imgDataArray.forEach((imageObject, index) => {
        const imgcard = imageGallery.querySelectorAll(".img-card")[index];
        const imgElement = imgcard.querySelector("img");
        const downloadBtn = imgcard.querySelector(".download-btn");

        const aiGeneratedImg = `data:image/jpeg;base64,${imageObject.b64_json}`;
        imgElement.src = aiGeneratedImg;

        imgElement.onload = () => {
            imgcard.classList.remove("loading");
            downloadBtn.setAttribute("href", aiGeneratedImg);
            downloadBtn.setAttribute("download", `${new Date().getTime()}.jpg`);
        };
    });
};

const generateAiImages = async (userPrompt, userImgQuantity) => {
    try {
        const response = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                prompt: userPrompt,
                n: parseInt(userImgQuantity),
                size: "512x512",
                response_format: "b64_json"
            })
        });

        const result = await response.json();

        if (!response.ok) {
            console.error("API error:", result);
            alert(result?.error?.message || "Failed to generate images.");
            return;
        }

        updateImageCard([...result.data]);

    } catch (error) {
        console.error("Error is:", error);
        alert("Something went wrong. Check the console for details.");
    }
};

const handleFormSubmission = (e) => {
    e.preventDefault();

    const userPrompt = e.srcElement[0].value.trim();
    const userImgQuantity = e.srcElement[1].value;

    if (!userPrompt) {
        alert("Please enter a description.");
        return;
    }

    const imgCardMarkup = Array.from({ length: userImgQuantity }, () =>
        `<div class="img-card loading">
            <img src="loader.svg" alt="">
            <a href="#" class="download-btn">
                <img src="download.svg" alt="">
            </a>
        </div>`
    ).join("");

    imageGallery.innerHTML = imgCardMarkup;

    generateAiImages(userPrompt, userImgQuantity);
};

generateForm.addEventListener('submit', handleFormSubmission);
