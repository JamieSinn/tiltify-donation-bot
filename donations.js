const fs = require('fs');
const fetch = require("node-fetch");
const guildData = './data/guilds.json';
const Discord = require('discord.js');

module.exports = (client, guild, forceShow, callback) => {
	fetch(`https://tiltify.com/api/v3/campaigns/${guild.tiltifyCampaignID}/donations`, {
		method: 'GET',
		headers: {
			'Authorization': `Bearer ${guild.tiltifyAuthToken}`
		},
		dataType: 'json',
	}).then(response => response.json())
		.then(json => {
			donationData = json;
			try {
				donation = donationData.data[0];
				if (forceShow || donation.id !== guild.lastDonationID) {
					let donationEmbed = new Discord.MessageEmbed()
						.addFields(
							{ name: "undefined", value: "undefined" },
						)
					donationEmbed.setTitle('A new donation has been received!')
					donationEmbed.setURL(guild.campaignURL)
					donationEmbed.fields[0].name = `${donation.name} donates $${donation.amount}`;
					if (donation.comment.length > 0)
						donationEmbed.fields[0].value = donation.comment;
					else
						donationEmbed.fields[0].value = "";
					donationEmbed.setTimestamp()
					donationEmbed.setFooter('Thank you for your donation!')
					guild.lastDonationID = donation.id;
					client.channels.cache.get(guild.channel).send(donationEmbed);		
					callback(donation);			
				}
			}
			catch { console.log('Error while requesting donation data.') }
		});
}