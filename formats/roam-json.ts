import { FormatImporter } from "../format-importer";
import { FileSystemAdapter, Notice, Setting } from "obsidian";
import * as path from 'path';
import { importRoamJson } from "./roam/roam";

export class RoamJSONImporter extends FormatImporter {
	downloadAttachmentsSetting: Setting;
	downloadAttachments: boolean = false;

	init() {
		this.addFileOrFolderChooserSetting('Roam (.json)', ['json']);
		this.addOutputLocationSetting('Roam');
		this.modal.contentEl.createEl('h3', {text: 'Import Settings'});


		this.downloadAttachmentsSetting = new Setting(this.modal.contentEl)
            .setName('Download all Attachments')
			.setDesc('If enabled every attachment uploaded to roam will be downloaded to a local folder. WARNING this can take a large amount of space.')
            .addToggle(toggle => {
                toggle.setValue(this.downloadAttachments)
                toggle.onChange(async (value) => {
                    this.downloadAttachments = value;
                });
            });
	}

	async import() {
		console.log(this)
		let { filePaths } = this;
		if (filePaths.length === 0) {
			new Notice('Please pick at least one JSON file to import.');
			return;
		}

		let folder = await this.getOutputFolder();
		if (!folder) {
			new Notice('Please select a location to export to.');
			return;
		}

		let { app } = this;
		let adapter = app.vault.adapter;
		if (!(adapter instanceof FileSystemAdapter)) return;

		let roamOptions = {
			saveAttachments: true,
			jsonSources: filePaths,
			outputDir: path.join(adapter.getBasePath(), folder.path),
			downloadAttachments:this.downloadAttachments
		};

		let results = await importRoamJson(roamOptions);

		this.showResult(results);
	}
}
