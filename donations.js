const fs = require('fs');
const fetch = require('node-fetch');
const guildData = './data/guilds.json';
const Discord = require('discord.js');

module.exports = (client, guild, forceShow, callback) => {
	for (const [key, campaign] of Object.entries(guild.campaigns)) {
		if(campaign === null || campaign === undefined)
		{
			continue;
		}

		console.log(campaign);
		fetch(`https://tiltify.com/api/v3/campaigns/${campaign.tiltifyCampaignID}/donations`, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${campaign.tiltifyAuthToken}`
			},
			dataType: 'json',
		}).then(response => response.json())
			.then(donationData => {
				try {
					donation = donationData.data[0];
					if (forceShow || donation.id !== campaign.lastDonationID) {
						let donationEmbed = new Discord.MessageEmbed()
							.addFields(
								{ name: "undefined", value: "undefined" },
							);
						let whoCampaign = campaign.campaignURL.split("/")[3].replace("@","");
						donationEmbed.setTitle(`A new donation has been received for ${whoCampaign}!`)
						donationEmbed.setURL(campaign.campaignURL)
						donationEmbed.fields[0].name = `${donation.name} donates $${donation.amount}`;
						if (donation.comment.length > 0)
							donationEmbed.fields[0].value = donation.comment;
						else
							donationEmbed.fields[0].value = 'No comment.';
						donationEmbed.setTimestamp()
						donationEmbed.setFooter('Thank you for your donation!')
						campaign.lastDonationID = donation.id;
						client.channels.cache.get(campaign.channel).send(donationEmbed);
						callback(donation);
					}
				}
				catch(e) {
				 console.log('Error while requesting donation data.');
				 console.log(e);
				 };
			});
	}
}