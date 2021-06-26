const { Client, MessageEmbed } = require('discord.js');
const bot = new Client();
const fs = require('fs');
const spawn = require("child_process").spawn;
const roblox = require("noblox.js");
const PREFIX = '-';
token = 'NzQxNjgxNDE1Mjc5NjA3OTM2.Xy7GpQ.uz_P46kGtFTfCgunsgE4IeLg8I8';

function run(cookie) {
  fs.readFile('cookie.txt', 'utf8', (err, data) => {
    if (err) throw err;
    roblox.setCookie(data).catch(err => {if (err) console.log('invalid cookie provided')});
  })
}

run();

function getIdFromUsername(name) {
  const userId = roblox.getIdFromUsername(name).then(id => {
    return(id);
  }).catch(err => {
    if (err) {
      throw err;
    }
  })
  return userId;
}

bot.on("ready", ready=>{
  console.log(`ready and logged into ${bot.user.username}`);
})

bot.on("message", message=>{
  if(message.content.startsWith(PREFIX)){
    let args = message.content.substring(PREFIX.length).split(" ");
    switch (args[0]) {
      case 'quests':
        if (message.channel.type == 'dm') {
          message.channel.send("This command cannot be used in dms...");
          return;
        }
          fs.readFile('questsgames.txt', 'utf8', (err, data) => {
            if(err){
              const error = new MessageEmbed()
                .setTitle('Error!')
                .setDescription("There is no file!")
                .setFooter("Get oofed on");
              message.channel.send("oof", error);
              return;
            }else {
              var quests = data.split(":");
              if (args[1]) {
                if (quests.includes(args[1])) {
                  fs.readFile(`${args[1]}.txt`, 'utf8', (err, data) => {
                    if (err) {
                      const error = new MessageEmbed()
                        .setTitle("I oofed")
                        .setDescription("There wasn't a file for that perticular game...")
                        .setFooter("Make sure to contact a Quest Manager");
                      message.channel.send('oof', error);
                      return;
                    }
                    var questObjects = data.split(':');
                    var somethingFound = false;
                    if (args[2] == 'claim') {
                      if (args[3]) {
                        questObjects.forEach(object => {
                          var questsTitle = object.split(',');
                          if (questsTitle[0] == args[3]) {
                            var index = questObjects.indexOf(object);
                            var claimedQuest = questObjects[index];
                            questObjects.splice(index,1);
                            var updatedData = questObjects.join(":");
                            fs.readFile("activequests.txt", "utf8", (err,data) => {
                              if (err) {
                                message.channel.send("i ooped");
                                return;
                              }
                              var activequests = data.split(":");
                              var counter = 0;
                              for (var i = 0; i < activequests.length; i++) {
                                activeQuestsData = activequests[i].split(",");
                                if (activeQuestsData[0] == message.author.id) {
                                  counter++;
                                }
                                if (counter > 1) {
                                  message.channel.send("You can only have 2 active quests at a time!");
                                  return;
                                }
                              }
                              fs.writeFile(`${args[1]}.txt`, updatedData, err => {
                                if (err) throw err;
                              })
                              var updatedData1 = activequests.join(":") + `:${message.author.id},${claimedQuest}`;
                              fs.writeFile("activequests.txt", updatedData1, err => {
                                if (err) throw err;
                                message.channel.send("Yay! You have sucessfully claimed that quest, check active quests by doing ``-active``");
                              })
                            })
                            return somethingFound = true;
                          }

                        })
                        if (!somethingFound == true) {
                          message.channel.send("nothing found :(");
                        }
                      }else {
                        message.channel.send("Invalid format, please use **-quests <game> claim <title of game>** for any help visit <#742946692432789635>");
                      }
                    }else {
                      var black = '``'
                      const questsMsg = new MessageEmbed()
                        .setTitle("Quests!")
                        .setFooter("Thanks for using us!")
                        .setTimestamp();
                        if (!data) {
                          questsMsg.setDescription("Uh oh, there arent anymore quests for this game...");
                          message.channel.send(questsMsg);
                          return;
                        }
                        questsMsg.setDescription(`these are all the quests for the game **${args[1]}**, to claim any of them type ${black}-quests ${args[1]} claim <title>${black}`);
                      questObjects.forEach(object => {
                        var questsdata = object.split(",");
                        if (questsdata[1] != undefined) {
                          questsMsg.addField(questsdata[0], `${questsdata[1]}\nAmount: **${questsdata[2]}** R$`);
                        }
                      });
                      message.channel.send(questsMsg);
                    }
                  })
                }else {
                  message.channel.send("that isn't a valid game...");
                }
              }else {
                var black = '``';
                const questsMsg = new MessageEmbed()
                  .setTitle("Quests!")
                  .setDescription('Below are the following quests...')
                quests.forEach(game => {
                  questsMsg.addField(game, `type ${black}-quests ${game}${black} to see all the quests for this game...`);
                });
                message.channel.send(questsMsg);
              }
          }
        });
      break;

      case 'active':
        if (message.channel.type == 'dm') {
          message.channel.send("This command cannot be used in dms...");
          return;
        }
        fs.readFile(`activequests.txt`, 'utf8', (err, data) => {
          if (err) {
            message.channel.send("Uh oh, im missing the active quests file...");
            return;
          }
          var activequests = data.split(":");
          if (args[1]) {
            if (args[1] == 'submit') {
              if (args[2]) {
                let questCount = new Array();
                let array = new Array();
                var questFound = false;
                activequests.forEach(questObject => {
                  var questsData = questObject.split(",");
                  if (questsData[0] == message.author.id) {
                    if (args[2] == '2') {
                      if (questCount[0]) {
                        array.push(questObject);
                      }else {
                        questCount.push('found');
                      }
                    }else {
                      array.push(questObject)
                    }
                    if (questFound == true) {
                      return;
                    }else {
                      if (array[0] != undefined) {
                        var index = activequests.indexOf(array[0]);
                        activequests.splice(index, 1);
                        let updatedData = activequests.join(":");
                        fs.writeFile('activequests.txt', updatedData, err => {
                          if (err) {
                            var errorMsg = new MessageEmbed()
                              .setTitle("frick...")
                              .setDescription("i ooped :(")
                              .setFooter("Contact an admin")
                              .setTimestamp();
                            return message.channel.send("rip", errorMsg);
                          }
                          fs.readFile('ids.txt', 'utf8', (err, data) => {
                            if (err) {
                              var errorMsg = new MessageEmbed()
                                .setTitle("Uh oh!")
                                .setDescription("there is no ids file...")
                                .setFooter("Please contact admin")
                                .setTimestamp();
                              return message.channel.send('crud...', errorMsg);
                            }
                            var id = parseInt(data, 10);
                            id++;
                            fs.writeFile("ids.txt", `${id}`, err => {
                              if (err){
                                message.channel.send("i ooped...");
                              }
                            })
                            var submitedQuest = array[0] + `,${id}`;
                            fs.readFile('pendingquests.txt', 'utf8', (err, data) => {
                              if (err) {
                                const errorMsg = new MessageEmbed()
                                .setTitle("Riperoni")
                                .setDescription("i couldn't read the pending quest file")
                                .setFooter("Please contact an admin")
                                .setTimestamp();
                                return message.channel.send("rip", errorMsg);
                              }
                              var pendingQuests = data.split(":");
                              pendingQuests.push(submitedQuest);
                              var updatedData2 = pendingQuests.join(":");
                              fs.writeFile("pendingquests.txt", updatedData2, err => {
                                if (err) {
                                  message.channel.send("i ooped...");
                                  return;
                                }
                                var black = "``";
                                let questData = array[0].split(",");
                                const awaitingApproval = new MessageEmbed()
                                  .setTitle(`Quest id: ${id}`)
                                  .setAuthor(message.author.username, message.author.avatarURL())
                                  .setDescription(`Accept this quest by typing ${black}-accept ${id}${black}!`)
                                  .addField(questData[1], `${questData[2]}\nAmount: **${questData[3]}** R$`)
                                  .setFooter(`Quest claimed at`)
                                  .setTimestamp();
                                message.guild.channels.cache.get("742948585414328350").send(message.author, awaitingApproval);
                                message.channel.send("Quest submited! Check it out <#742948585414328350>");
                              })
                            })
                          })
                        })
                        return questFound = true;
                      }
                    }
                  }
                })
              }else {
                message.channel.send("What quest would you like to submit?");
              }
            }else {
              message.channel.send("did you mean submit?");
            }
            return;
          }
          var foundSomething = false;
          var activeMsg = new MessageEmbed()
            .setTitle("Active Quests!")
            .setAuthor(message.author.username, message.author.avatarURL())
            .setFooter("Thanks for using us!")
            .setTimestamp();
          let questCount = new Array();
          activequests.forEach(questobject => {
            var questsdata = questobject.split(",");
            if (questsdata[1] != undefined) {
              if(questsdata[0] == message.author.id){
                var title;
                if (questCount[0]) {
                  title = `2: ${questsdata[1]}`;
                }else {
                  title = `1: ${questsdata[1]}`;
                  questCount.push(1);
                }
                activeMsg.addField(title, `${questsdata[2]}\nAmount: **${questsdata[3]}** R$`);
                return foundSomething = true;
              }
            }
          })
          if (!foundSomething) {
            activeMsg.setDescription("Looks like you haven't started any quests yet...");
          }else {
            activeMsg.setDescription("Below are your active quests! To submit one type ``-active submit <1 or 2>``");
          }
          message.channel.send(activeMsg);
        })
      break;

      case 'accept':
        if (message.channel.type == 'dm') {
          message.channel.send("This command cannot be used in dms...");
          return;
        }
        if (message.author.id != '430174837911060490') {
          message.channel.send("Only mutant can do this command...");
          return;
        }
        if (args[1]) {
          fs.readFile('pendingquests.txt', 'utf8', (err, data) => {
            if (err) {
              const error = new MessageEmbed()
                .setTitle('Error!')
                .setDescription('Theres no pending quest file!')
                .setFooter("Please contact an admin!")
                .setTimestamp();
              message.channel.send('rip', error);
              return;
            }
            var pendingQuestsObjects = data.split(':');
            var isFound = false;
            pendingQuestsObjects.forEach(object => {
              var objectData = object.split(',');
              if (objectData[5] == args[1]) {
                var person = message.guild.members.cache.get(objectData[0]);
                if (person == undefined) {
                  message.channel.send("there was a fatal error...");
                  return;
                }else {
                  var black = '``';
                  const msg = new MessageEmbed()
                    .setTitle(`Your quest has been accepted!`)
                    .setDescription(`You can pay yourself out by typing ${black}-payout ${args[1]} <roblox-username>${black}`)
                    .setFooter('This quest was accepted')
                    .setTimestamp()
                    .addField(objectData[1], `${objectData[2]}\nAmount: **${objectData[3]}** R$`);
                  person.send('Woohoo!',msg);
                  var index = pendingQuestsObjects.indexOf(object);
                  pendingQuestsObjects.splice(index, 1);
                  var updatedData = pendingQuestsObjects.join(':');
                  fs.writeFile('pendingquests.txt', updatedData, err => {
                    if (err) {
                      const error = new MessageEmbed()
                        .setTitle('Error!')
                        .setDescription("I ooped while writing the file")
                        .setFooter("I ooped")
                        .setTimestamp();
                      message.channel.send('rip', error);
                      return;
                    }
                    fs.readFile('acceptedquests.txt', 'utf8', (err, data) => {
                      if (err) {
                        const error = new MessageEmbed()
                          .setTitle('Error!')
                          .setDescription("I couldn't read the accepted quests file")
                          .setFooter('i ooped')
                          .setTimestamp();
                        message.channel.send('rip', error);
                        return;
                      }
                      let acceptedQuests = data.split(":");
                      acceptedQuests.push(object);
                      var updatedData1 = acceptedQuests.join(":");
                      fs.writeFile('acceptedquests.txt', updatedData1, err => {
                        if (err) {
                          const error = new MessageEmbed()
                            .setTitle("Error!")
                            .setDescription("I had an error while writing to the accepted quests file")
                            .setFooter("I ooped")
                            .setTimestamp();
                          message.channel.send(error);
                          return;
                        }
                        message.channel.send("Yay, you succesfully accepted that quest...");
                      })
                    })
                  })
                }
                return isFound = true;
              }
            })
            if (isFound == false) {
              message.channel.send('No such id was found :/');
            }
          })
        }else {
          message.channel.send("You must include the id that is going to be accepted...");
        }
      break;

      case 'decline':
        if (message.channel.type == 'dm') {
          message.channel.send("This command cannot be used in dms...");
          return;
        }
        if (message.author.id != '430174837911060490') {
          message.channel.send("Only mutant can use this command!");
          return;
        }
        if (args[1]) {
          fs.readFile('pendingquests.txt', 'utf8', (err, data) => {
            if (err) {
              const error = new MessageEmbed()
                .setTitle('Error!')
                .setDescription("I had an error while reading the pendingquests file...")
                .setFooter("I errored")
                .setTimestamp();
              message.channel.send('oof', error);
              return;
            }
            var pendingQuests = data.split(":");
            var isFound = false;
            pendingQuests.forEach(object => {
              var objectData = object.split(",");
              if (objectData[5] == args[1]) {
                var index = pendingQuests.indexOf(object);
                pendingQuests.splice(index, 1);
                var updatedData = pendingQuests.join(":");
                fs.writeFile('pendingquests.txt', updatedData, err => {
                  if (err) {
                    const error = new MessageEmbed()
                      .setTitle("Error!")
                      .setDescription("I had an error while writing to the pendingquests file...")
                      .setFooter("I errored")
                      .setTimestamp();
                    message.channel.send("Rip", error);
                    return;
                  }
                  if (args[2]) {
                    fs.readFile(`${args[2]}.txt`, 'utf8', (err, data) => {
                      if (err) {
                        var black = '``';
                        const error = new MessageEmbed()
                          .setTitle("Thats not a game...")
                          .setDescription(`There is no game made for ${black}${args[2]}${black} but I still declined the quest...`)
                          .setFooter("Big sad...")
                          .setTimestamp();
                        message.channel.send("Rip", error);
                        return;
                      }
                      var gameQuests = data.split(":");
                      gameQuests.push(`${objectData[1]},${objectData[2]},${objectData[3]},false`);
                      var updatedData = gameQuests.join(":");
                      fs.writeFile(`${args[2]}.txt`, updatedData, err => {
                        if (err) {
                          var black = '``';
                          const error = new MessageEmbed()
                            .setTitle("Error!")
                            .setDescription(`I errored while writing to the ${black}${args[2]}${black} :(`)
                            .setFooter("i oofed")
                            .setTimestamp();
                          message.channel.send('Oof', error);
                          return;
                        }
                        message.channel.send("I declined and added back to the original place...");
                      })
                    })
                  }else {
                    message.channel.send("I declined that quest...");
                  }
                })
                return isFound = true;
              }
            })
            if (isFound == false) {
              message.channel.send("I couldn't find a quest with that id...")
            }
          })
        }else {
          message.channel.send("You must include the id that you wan't me to decline...");
        }
      break;

      case 'payout':
        if (args[1]) {
          if (args[2]) {
            fs.readFile('acceptedquests.txt', 'utf8', (err, data) => {
              if (err) {
                const error = new MessageEmbed()
                  .setTitle("Error!")
                  .setDescription("I couldn't read the accepted quests file, please dm mutant!")
                  .setFooter("I ooped")
                  .setTimestamp();
                message.channel.send(error);
                return;
              }
              var acceptedQuests = data.split(":");
              var isFound = false;
              acceptedQuests.forEach(object => {
                var objectData = object.split(",");
                if (objectData[0] == message.author.id) {
                  if (objectData[5] == args[1]) {
                    fs.readFile('groupid.txt', 'utf8', (err, data) => {
                      if (err) {
                        const error = new MessageEmbed()
                          .setTitle("Error!")
                          .setDescription("There is no group id set...")
                          .setFooter("Please contact mutant...")
                          .setTimestamp();
                        message.channel.send(error);
                        return;
                      }
                      var groupId = parseInt(data, 10);
                      getIdFromUsername(args[2]).then(id => {
                        var amount = parseInt(objectData[3], 10);
                        var index = acceptedQuests.indexOf(object);
                        acceptedQuests.splice(index, 1);
                        var updatedData = acceptedQuests.join(":");
                        roblox.groupPayout({ group: groupId, member: id, amount: amount}).then(() => {
                          fs.writeFile('acceptedquests.txt', updatedData, err => {
                            if (err) {
                              const error = new MessageEmbed()
                                .setTitle("Error")
                                .setDescription("I had an error while writing to the accepted quests file...")
                                .setFooter("Contact an admin")
                                .setTimestamp();
                              message.channel.send('oop', error);
                              return;
                            }
                            var black = '``';
                            bot.channels.cache.get("751530915569598634").send(`Payed ${black}${amount}${black} R$ to ${message.author}!`);
                            message.channel.send(`Succesfully paid out to ${black}${args[2]}${black} :)`);
                          })
                        }).catch(err => {
                          if (err) {
                            message.channel.send(`Please join the group at https://www.roblox.com/groups/${groupId}/about/ then try again...`);
                          }
                        })
                      }).catch(err => {
                        if (err) {
                          const error = new MessageEmbed()
                            .setTitle('Error!')
                            .setDescription("Invalid roblox username...")
                            .setFooter('Fetched')
                            .setTimestamp();
                          message.channel.send('rip', error);
                        }
                      })
                    })
                    return isFound = true;
                  }
                }
              })
              if (isFound == false) {
                message.channel.send('no such ID under your name matched... If you believe this is an error contact MutantRabbit767');
                return;
              }
            })
          }else {
            message.channel.send("You must include a person to payout...");
            return;
          }
        }else {
          message.channel.send("You must include an id");
          return;
        }
      break;      
    }
  }else{
    return;
  }
})

bot.login(token);
