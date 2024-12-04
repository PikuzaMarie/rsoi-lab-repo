$(document).ready(function () {
	//getScript() for loading Dialogue (annoying, super annoying, comment it)
	$.getScript(
		"https://code.jquery.com/ui/1.12.1/jquery-ui.min.js",

		() => {
			if ($.fn.dialog) {
				setTimeout(function () {
					console.log("Opening dialog after 3 seconds...");
					$("#dialog").dialog({
						modal: true,
						width: 400,
						resizable: false,
						closeText: "Close",
						open: function () {
							console.log("Dialog opened!");
						},
						close: function () {
							console.log("Dialog closed!");
						},
					});
				}, 3000);
			} else {
				console.log("jQuery UI Dialog method is NOT available");
			}

			$("#close-dialog").click(function () {
				console.log("Closing dialog...");
				$("#dialog").dialog("close");
			});
		}
	);
	// Here goes the main functionality, but first things first lets define variables
	const contentCountSelect = $("#content-count");
	const textColorSelect = $("#text-color");
	const fontSelect = $("#font-family");
	const loadContentButton = $("#load-content");
	const contentContainer = $("#content-container");
	const loadingIndicator = $("#loading");

	let contentCount = 1;

	contentCountSelect.click(() => (contentCount = contentCountSelect.val()));

	const handleSuccessQuotes = (result) => {
		const quotes = result.quotes.slice(0, contentCount);

		const textColor = textColorSelect.val();
		const fontFamily = fontSelect.val();

		quotes.forEach(function (quote) {
			const quoteText = quote.quote;
			const quoteElement = $('<div class="quote"></div>').text(quoteText).css({
				color: textColor,
				"font-family": fontFamily,
			});

			contentContainer.append(quoteElement);
		});
	};

	const handleSuccessMemes = (result) => {
		const textColor = textColorSelect.val();
		const fontFamily = fontSelect.val();

		result.memes.forEach(function (meme) {
			const memeUrl = meme.url;
			const memeTitle = meme.title;

			const memeElement = $('<div class="meme"></div>')
				.append(`<img src="${memeUrl}" alt="${memeTitle}" />`)
				.append(`<h5 class="meme-title">${memeTitle}</h5>`);

			memeElement.find("h5").css({
				color: textColor,
				"font-family": fontFamily,
			});

			contentContainer.append(memeElement);
		});
	};

	const handleError = () => {
		console.error("Error with loading content:", error, jqXHR.status);
		contentContainer.html(
			"<p>There was an error loading the jokes. Please try again later.</p>"
		);
	};

	const handleComplete = () => {
		loadingIndicator.hide();
		loadContentButton.prop("disabled", false);
	};

	const loadQuotes = () => {
		const skip = Math.floor(Math.random() * 1000); //to randomize it a bit :))
		$.ajax({
			method: "GET",
			url: `https://dummyjson.com/quotes?skip=${skip}`,
			success: (result) => handleSuccessQuotes(result),
			error: (jqXHR, error) => handleError(jqXHR, error),
			complete: () => handleComplete(),
		});
	};

	const loadMemes = () => {
		$.ajax({
			method: "GET",
			url: `https://meme-api.com/gimme/${contentCount}`,
			success: (result) => handleSuccessMemes(result),
			error: (jqXHR, error) => handleError(jqXHR, error),
			complete: () => handleComplete(),
		});
	};

	loadContentButton.click(() => {
		const contentType = $('input[name="content-type"]:checked').val();

		contentContainer.empty();
		loadingIndicator.show();

		loadContentButton.prop("disabled", true);

		if (contentType === "quote") {
			//Getting quotes form API
			loadQuotes(contentCount);
		} else if (contentType === "meme") {
			//Loading memes from API
			loadMemes(contentCount);
		}
	});
});
