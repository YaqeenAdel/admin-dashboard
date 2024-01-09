export default {
	myVar1: [],
	myVar2: {},
	myFun1 () {
		//	write code here
		//	this.myVar1 = [1,2,3]
	},
	async updateTranslations () {
		// Loop through each translation
		for(let translation of Edit.formData.Translations) {

			// Update translation data

			// Call mutation to edit
			await EditTranslation.run({
				TranslationId: translation.TranslationId,
				Language: translation.Language,
				Translation: translation.data
			});

		}

		// Refresh data
		return await Translations.run();
	}
}