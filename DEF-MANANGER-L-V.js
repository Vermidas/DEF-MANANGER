// ==UserScript==
// @name           DEF MANANGER
// @author         Sakrileg
// @version        2
// @grant          none
// @include        https://*.die-staemme.de*&screen=overview*
// @include        https://*.die-staemme.de*&screen=settings*
// @include        https://*.die-staemme.de*screen=overview_villages*
// @include        https://*.die-staemme.de*screen=place*
// @include        https://*.die-staemme.de*screen=map*
// @include        https://*.die-staemme.de*screen=mail*mode=view*
// @include        https://*.die-staemme.de*screen=memo*
// @include        https://*.die-staemme.de*screen=forum*
// @include        https://*.die-staemme.de*screen=info_village*
// ==/UserScript==

 var urlgithub = 'https://raw.githubusercontent.com/Vermidas/DEF-MANANGER/main/Lizenz.txt';
 var userName = window.game_data.player.name;
 
 fetch(urlgithub)
   .then(response => response.text())
   .then(data => {
     if (data.includes(userName)) {

 if (typeof window.twLib === 'undefined') {
  window.twLib = {
      queues: null,
      init: function () {
          if (this.queues === null) {
              this.queues = this.queueLib.createQueues(5);
          }
      },
      queueLib: {
          maxAttempts: 3,
          Item: function (action, arg, promise = null) {
              this.action = action;
              this.arguments = arg;
              this.promise = promise;
              this.attempts = 0;
          },
          Queue: function () {
              this.list = [];
              this.working = false;
              this.length = 0;

              this.doNext = function () {
                  let item = this.dequeue();
                  let self = this;

                  if (item.action === 'openWindow') {
                      window.open(...item.arguments).addEventListener('DOMContentLoaded', function () {
                          self.start();
                      });
                  } else {
                      $[item.action](...item.arguments).done(function () {
                          item.promise.resolve.apply(null, arguments);
                          self.start();
                      }).fail(function () {
                          item.attempts += 1;
                          if (item.attempts < twLib.queueLib.maxAttempts) {
                              self.enqueue(item, true);
                          } else {
                              item.promise.reject.apply(null, arguments);
                          }

                          self.start();
                      });
                  }
              };

              this.start = function () {
                  if (this.length) {
                      this.working = true;
                      this.doNext();
                  } else {
                      this.working = false;
                  }
              };

              this.dequeue = function () {
                  this.length -= 1;
                  return this.list.shift();
              };

              this.enqueue = function (item, front = false) {
                  (front) ? this.list.unshift(item) : this.list.push(item);
                  this.length += 1;

                  if (!this.working) {
                      this.start();
                  }
              };
          },
          createQueues: function (amount) {
              let arr = [];

              for (let i = 0; i < amount; i++) {
                  arr[i] = new twLib.queueLib.Queue();
              }

              return arr;
          },
          addItem: function (item) {
              let leastBusyQueue = twLib.queues.map(q => q.length).reduce((next, curr) => (curr < next) ? curr : next, 0);
              twLib.queues[leastBusyQueue].enqueue(item);
          },
          orchestrator: function (type, arg) {
              let promise = $.Deferred();
              let item = new twLib.queueLib.Item(type, arg, promise);

              twLib.queueLib.addItem(item);

              return promise;
          }
      },
      ajax: function () {
          return twLib.queueLib.orchestrator('ajax', arguments);
      },
      get: function () {
          return twLib.queueLib.orchestrator('get', arguments);
      },
      post: function () {
          return twLib.queueLib.orchestrator('post', arguments);
      },
      openWindow: function () {
          let item = new twLib.queueLib.Item('openWindow', arguments);

          twLib.queueLib.addItem(item);
      }
  };

  twLib.init();
}

(async () => {
      const settings = {
          version: '1.5.1',
          get script() {
              return `def_pack_AF_v${this.version}`;
          },
          general: {
              night: {
                  text: 'Night',
                  id: 'defPackNightMode'
              },
              duplicateChecker: {
                  text: 'Duplicates Checker',
                  id: 'defPackDuplicatesChecker'
              },
              incomingsOverviewEnhancement: {
                  text: 'Incomings Overview Enhancements',
                  id: 'defPackIncomingsOverviewEnhancements'
              },
              requestOSOverviewEnhancement: {
                  text: 'Request OS Enhancements',
                  id: 'defPackRequestOSEnhancements'
              },
              useSanguTaggerSettings: {
                  text: 'Use Sangu Tagger Settings',
                  id: 'defPackUseSanguTaggerSettings'
              },
              showNextIncBrowserTab: {
                  text: 'Show Next Incoming In Browser Tab',
                  id: 'defPackShowNextIncBrowserTab'
              },
              addStackHealthMap: {
                  text: 'Add Stack Health Info on the Map',
                  id: 'defPackAddStackHealthMap'
              },
              addAdvancedTaggingInterfaceOnOverviewScreen: {
                  text: `Add Advanced Tagging Interface On Overview (Will <strong>NOT</strong> activate with Sangu active!)`,
                  id: 'defPackAddAdvancedTaggingInterfaceOnOverviewScreen'
              },
              disableDoubleCheckingIfSanguIsNotActive: {
                  text: `<strong>Disable</strong> Double Checking If Sangu Is Auto Executed By TW Extension. (Only works if option above is checked.)`,
                  id: 'defPackDisableDoubleCheckingIfSanguIsNotActive'
              },
              addAdvancedTaggingInterfaceOnInfoVillageScreen: {
                  text: `Add Advanced Tagging Interface On Info Village Screen`,
                  id: 'defPackAddAdvancedTaggingInterfaceOnInfoVillageScreen'
              },
              restyleWidgetsOnOverviewScreen: {
                  text: `Re-organize widgets when receiving incomings On Village Overview Screen`,
                  id: 'defPackRestyleWidgetsOnOverviewScreen'
              }
          },
          stackHealth: {
              ignoreScoutsInStackHealthCheck: {
                  text: 'Ignore Scouts In Stack Health Check Simulation',
                  id: 'defPackIgnoreScoutsInStackHealthCheck'
              },
              ignoreOwnTroopsInStackHealthCheck: {
                  text: `Ignore Own Troops In Stack Health Check Simulation`,
                  id: 'defPackIgnoreOwnTroopsInStackHealthCheck'
              }
          },
          boostData: {
              wall: {type: 'b_walleffectiveness'},
              unit_sword: {type: 'b_unitstat', description: 'defense_all'},
              unit_spear: {type: 'b_unitstat', description: 'defense_all'},
              unit_archer: {type: 'b_unitstat', description: 'defense_all'},
              unit_heavy: {type: 'b_unitstat', description: 'defense_all'},
              unit_axe: {type: 'b_unitstat', description: 'attack'},
              unit_light: {type: 'b_unitstat', description: 'attack'},
              unit_marcher: {type: 'b_unitstat', description: 'attack'},
              benefit_resist_demolition: {type: 'b_resistdemolition'}
          },
          standard: {
              preStackData: {
                  OK: {
                      clears: 10,
                      color: 'darkgreen',
                      message: 'GEDEFFT',
                      population: 100000,
                      bgColor: '#FF6347'
                  },
                  STACK_MORE: {
                      clears: 5,
                      color: 'darkblue',
                      message: 'NACHDEFFEN!',
                      population: 60000,
                      bgColor: '#3CB371'
                  },
                  NOK: {
                      clears: 0,
                      color: 'red',
                      message: 'DEFFEN',
                      population: 0,
                      bgColor: '#DED3B9'
                  }
              },
              incomingStackData: {
                  OK: {
                      clears: 7,
                      color: 'darkgreen',
                      message: 'GEDEFFT',
                      population: 100000,
                      bgColor: '#FF6347'
                  },
                  STACK_MORE: {
                      clears: 4,
                      color: 'darkblue',
                      message: 'test!',
                      population: 60000,
                      bgColor: '#3CB371'
                  },
                  NOK: {
                      clears: 0,
                      color: 'red',
                      message: 'DEFFEN',
                      population: 0,
                      bgColor: '#DED3B9'
                  }
              },
              offBoosts: {axe: 8, light: 8, marcher: 8},
              offTechLevels: {axe: 3, light: 3, marcher: 3, ram: 3, catapult: 3},
              clear: {axe: 7000, spy: 50, light: 2800, marcher: 100, heavy: 0, ram: 350, catapult: 10},
              taggerData: {
                  OK: {tag: '[+++]', message: '[+++]', shortKey: '', color: '#419100'},
                  DODGED: {tag: '[---]', message: '[---]', shortKey: '', color: '#efefef'},
                  DODGE: {tag: '>>>> DODGE THIS <<<<', message: 'DODGE THIS', shortKey: '', color: '#efefef'},
                  SNIPED: {tag: '- SNIPE [OK]', message: 'SNIPE OK', shortKey: '', color: '#efefef'},
                  SNIPE_THIS: {tag: '>>>> SNIPE THIS <<<<', message: 'SNIPE THIS', shortKey: '', color: '#efefef'},
                  CHECK_STACK: {tag: '>>>> CHECK STACK <<<<', message: 'CHECK STACK', shortKey: '', color: '#efefef'}
              }
          },
          troopPop: {spear: 1, sword: 1, axe: 0, archer: 1, spy: 0, light: 1, marcher: 1, heavy: 4, ram: 0, catapult: 0, knight: 1},
          reservedWords: [ // Thank you Sangu!
              "AG", "Edelman",
              "Ramme", "Kata.", "Katapult",
              "SKAV", "Zware cavalerie",
              "LKAV", "Lichte Cavalerie", "Bereden boog", "Bboog.",
              "Späh", "Verkenner",
              "Axt", "Schwert", "Speer", "Bogen",
              "Paladin"
          ],
          backend: 'https://devilicious.dev',
          images: {
              clear: `graphic/unit/att.png`,
              edit: `graphic/edit.png`,
              flag: (level) => `graphic/flags/small/${!level || level < 1 ? 1 : level}.png`,
              offBoost: `graphic/icons/benefit_resist_demolition.png`,
              techLevels: `graphic/overview/research.png`,
              get snipe() {
                  return `${settings.backend}/assets/img/snipe.png`;
              },
              settings: `graphic/icons/settings.png`,
              support: `/graphic/command/support.png`,
              attack: `/graphic/command/attack.png`,
              get lucifer() {
                  return `${settings.backend}/assets/img/lucifer.png`;
              },
              OK: 'https://cdn2.iconfinder.com/data/icons/weby-interface-vol-1-1/512/s_Approved-check-checkbox-confirm-green-success-tick-512.png',
              NOK: 'https://cdn4.iconfinder.com/data/icons/icocentre-free-icons/114/f-cross_256-512.png',
              NO_TAG: 'https://cdn0.iconfinder.com/data/icons/shift-free/32/Block-512.png',
              snobs: {
                  get OK() {
                      return settings.images.OK;
                  },
                  CHECK: 'https://cdn0.iconfinder.com/data/icons/shopping-and-ecommerce-15/512/sale_lineal_color_cnvrt-18-256.png',
                  get NOK() {
                      return settings.images.NOK;
                  }
              }
          },
          commands1000Overflow: 'Opmerking: Meer dan 1000 bijdragen; alleen de eerste 1000 bijdragen worden getoond.',
          incomingOverview: {
              nobleFilters: {
                  OK: '.quickedit-label:containsAnyWord(OK, SNIPED)',
                  CHECK: '.quickedit-label:containsAnyWord(CHECK)',
                  NOK: '.quickedit-label:not(:containsAnyWord(OK, SNIPED, CHECK))'
              }
          },
          maxAttackFlagPercentage: 10,
          maxOsBoost: 50,
          storageKeys: {
              config: `defPack_Config_${game_data.world}`,
              dateSelection: 'defPack_incomingsCustomDateSelection',
              defPackSettings: 'defPackSettings',
              selectVillages: 'defPack_selectVillages',
              snipeSettings: 'defPack_snipeSettings',
              supportTroopSettings: 'defPack_supportTroopSettings',
              techLevels: 'defPack_techLevels'
          },
          refreshPeriod: 24,
          tech: {
              url: `${game_data.link_base_pure}overview_villages&mode=tech&group=0&page=-1`,
              LEVELS: 1,
              NORMAL: 2
          }
      };
      let userData = {};
      let snipeSettings = {};
      let config = {};
      let techLevels = {};
      Number.prototype.round = function (places) {
          return +(Math.round(this + "e+" + places) + "e-" + places);
      };
      $.expr[":"].contains = $.expr.createPseudo(function (arg) {
          return function (elem) {
              return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
          };
      });
      $.expr[":"].containsAnyWord = $.expr.createPseudo(function (arg) {
          return function (elem) {
              return arg.split(',').map((a) => containsWord($(elem).text().toUpperCase(), a.toUpperCase().trim())).includes(true);
          };
      });
      String.prototype.toCoord = function (objectified) {
          let c = this.match(/\d{1,3}\|\d{1,3}/g)?.pop();
          return (objectified) ? {x: c.split('|')[0], y: c.split('|')[1]} : c;
      };
      String.prototype.getDateString = function () {
          let c = this.match(/(^|\W)vandaag|morgen|\d{1,2}\.\d{1,2}($|\W)/);
          return (c) ? c[0].trim() : null;
      };
      String.prototype.capitalize = function () {
          return this.charAt(0).toUpperCase() + this.slice(1)
      }

      window.convertToDate = (twDate) => {
          const t = twDate.match(/\d+:\d+:\d+.\d+/);
          const serverDate = $('#serverDate').text().replace(/\//g, '-').replace(/(\d{1,2})-(\d{1,2})-(\d{4})/g, '$3-$2-$1');
          let date = new Date(serverDate + ' ' + t);

          if (twDate.match('morgen')) {
              date.setDate(date.getDate() + 1);
              return date;
          } else if (twDate.match(/\d+\.\d+/)) {
              let monthDate = twDate.match(/\d+\.\d+/)[0].split('.');
              return new Date(date.getFullYear() + '-' + monthDate[1] + '-' + monthDate[0] + ' ' + t);
          } else {
              return date;
          }
      }
      const coordToObject = (coords) => {
          let c = coords.match(/\d{1,3}\|\d{1,3}/g).pop();
          return {x: c.split('|')[0], y: c.split('|')[1]};
      };

      function containsWord(str, word) {
          return str.match(new RegExp("\\b" + word + "\\b", "i")) != null;
      }

      const loadSnipeSettings = () => {
          snipeSettings = JSON.parse(localStorage.getItem(settings.storageKeys.snipeSettings)) || {};
          if (snipeSettings.units === undefined) snipeSettings.units = Object.keys(config.unitSpeedSettings).map((u) => {
              return {unit: u, enabled: false, amount: 1}
          });
          localStorage.setItem(settings.storageKeys.snipeSettings, JSON.stringify(snipeSettings));
      }

      loadUserData();

      if (game_data.features.Premium.active) {
          let questLog = $('#questlog, #questlog_new');
          if (questLog.length < 1) {
              $('.maincell').prepend(`<div style="position:fixed;"><div id="questlog" class="questlog"></div></div>`);
              questLog = $('#questlog');
          }
          questLog.append(
              `<div class="quest opened defPack_questSnipeFinder" style="background-image: url('${settings.images.snipe}');">
               <div class="quest_progress" style="width: 0%;"></div></div>`).append(`<div class="quest opened defPack_settingsButton" style="background-size: 26px; background-image: url('${settings.images.lucifer}')">
               <div class="quest_progress" style="width: 0%;"></div>
          </div>`
          );
          $('.defPack_questSnipeFinder').click(() => {
              openSnipeInterface();
          });
          $('.defPack_settingsButton').click(() => {
              const html = `
              <div style="min-width: 600px; min-height: 260px">
                  <div style="display: flex; justify-content: space-around;">
                      <div style="flex-grow: 1;">
                          <img style="float: left" src='${settings.images.lucifer}'>
                      </div>
                      <div style="flex-grow: 1; text-align: center">
                          <h2 style="padding-top: 15px">Devil's Def Pack Settings <small>v${settings.version}</small></h2>
                      </div>
                      <div style="flex-grow: 1;">
                          <img style="float: right" src='${settings.images.lucifer}'>
                      </div>
                  </div>
                  <div>
                      <table style="width: 100%;">
                      <tbody>
                      <tr>
                          <td valign="top" style="border: 1px solid #7d510f; background-color: #f4e4bc; height: 200px">
                              <table class="vis modemenu" style="width: 215px;">
                                  <tbody>
                                      <tr><td style="cursor: pointer; background-color: #cdad6d; font-weight: bold" class="defPack_settingMenu" data-setting="general"><img src="${settings.images.settings}"> General Settings</td></tr>
                                      <tr><td style="cursor: pointer; background-color: #cdad6d; font-weight: bold" class="defPack_settingMenu" data-setting="clear"><img src="${settings.images.clear}"> Clear Settings</td></tr>
                                      <tr><td style="cursor: pointer; background-color: #cdad6d; font-weight: bold" class="defPack_settingMenu" data-setting="offBoost"><img src="${settings.images.offBoost}"> Off Boost Settings</td></tr>
                                      ${config.worldSettings.tech === settings.tech.LEVELS ?
                  `<tr><td style="cursor: pointer; background-color: #cdad6d; font-weight: bold" class="defPack_settingMenu" data-setting="techLevels"> <img src="${settings.images.techLevels}"> Off Tech Level Settings</td></tr>`
                  : ''}
                                      <tr><td style="cursor: pointer; background-color: #cdad6d; font-weight: bold" class="defPack_settingMenu" data-setting="stackHealth"><img width="16px" src="${settings.images.OK}"> Stack Health Settings</td></tr>
                                      <tr><td style="cursor: pointer; background-color: #cdad6d; font-weight: bold" class="defPack_settingMenu" data-setting="tagger"><img src="${settings.images.edit}"> Tagger Settings</td></tr>
                                  </tbody>
                              </table>
                          </td>
                          <td valign="top" style="border: 1px solid #7d510f; background-color: #f4e4bc; width: 80%; height: 200px">
                              <table class="vis" style="width: 100%; height: 100%;" data-setting="general">
                                  <thead>
                                      <th colspan="2"><img src="${settings.images.settings}"> General Settings</th>
                                  </thead>
                                  <tbody>
                                      ${Object.keys(settings.general).map(setting =>
                  `<tr>
                                              <td>${settings.general[setting].text}</td>
                                              <td><input type="checkbox" id="${settings.general[setting].id}"></td>
                                          </tr>`).join('')}
                                  </tbody>
                              </table>
                              <table class="vis" style="width: 100%; height: 100%;display: none" data-setting="clear">
                                  <thead>
                                      <th><img src="${settings.images.clear}"> Clear Settings</th>
                                      <th><span class="icon header population"></span> <span class="defPack_settingsClearPop">${Object.keys(settings.standard.clear).reduce((a, b) => a + (userData.clear_data[b] * settings.troopPop[b]), 0)}</span></th>
                                  </thead>
                                  <tbody>
                                   ${Object.keys(settings.standard.clear).filter(unit => config.unitSpeedSettings[unit]).map(unit =>
                  `<tr>
                                          <td>
                                              <img src="graphic/unit/unit_${unit}.png" style="margin-right: 3px"><input type="input" id="defPack_${unit}" value="${userData.clear_data[unit]}">
                                          </td>
                                      </tr>`).join('')}
                                  </tbody>
                              </table>
                              <table class="vis" style="width: 100%;display: none" data-setting="offBoost">
                                  <thead>
                                      <th colspan="2"><img src="${settings.images.offBoost}"> Off Boost Settings</th>
                                  </thead>
                                  <tbody>
                                      <tr>
                                          <td>
                                          <img id="defPack_offFlag" width="16px" src="${settings.images.flag(userData.offFlag)}">
                                              <select id="defPack_offFlagBoostSelect">
                                                  ${[...Array(settings.maxAttackFlagPercentage)].map((_, percentage) => `
                                                  <option value="${percentage}">
                                                      ${percentage === 0 ? 'geen' : `+${percentage + 1}% aanvalssterkte`}
                                                  </option>`).join('')}
                                              </select>
                                          </td>
                                      </tr>
                                  ${Object.keys(settings.standard.offBoosts).filter(unit => config.unitSpeedSettings[unit]).map(unit =>
                  `<tr>
                                        <td style="height: 20px;">
                                          <img src="graphic/unit/unit_${unit}.png" style="margin-right: 3px"><input style="width: 10%" type="input" id="defPack_OffBoost_${unit}" value="${userData.offBoosts[unit]}">%
                                        </td>
                                      </tr>`).join('')}
                                  </tbody>
                              </table>
                               ${config.worldSettings.tech === settings.tech.LEVELS ?
                  `<table class="vis" style="width: 100%; display: none" data-setting="techLevels">
                                  <thead>
                                       <th colspan="2"><img src="${settings.images.techLevels}"> Off Tech Level Settings (0-3)</th>
                                  </thead>
                                  <tbody>
                                  ${Object.keys(settings.standard.offTechLevels).map(unit =>
                      `<tr>
                                                <td width="20%">${unit}</td>
                                                <td width="80%">
                                                    <img src="graphic/unit/unit_${unit}.png" style="margin-right: 3px"><input style="width: 10%" type="input" id="defPack_OffTechLevel_${unit}" value="${userData.offTechLevels[unit]}">
                                                </td>
                                           </tr>`).join('')}
                                  </tbody>
                              </table>` : ''}
                              <table class="vis" style="width: 100%; display: none" data-setting="stackHealth">
                                  <thead>
                                      <th colspan="2"><img width="16px" src="${settings.images.OK}"> Pre Stack Health Settings</th>
                                  </thead>
                                  <tbody>
                                   ${Object.keys(settings.standard.preStackData).filter(data => data !== 'NOK').map(data =>
                  `<tr>
                                          <td width="30%"><strong style="color: ${settings.standard.preStackData[data].color}">${settings.standard.preStackData[data].message}</strong></td>
                                          <td width="70%">
                                             More than <input type="input" class="defPackStackData_${data}" data-value="clears" value="${userData.stack_data[data].clears}"> Clears Total
                                          </td>
                                      </tr>`).join('')}
                                      ${Object.keys(settings.standard.preStackData).filter(data => data !== 'NOK').map(data =>
                  `<tr>
                                          <td width="30%"><input type="color" class="defPackStackData_${data}" data-value="bgColor" value="${userData.stack_data[data].bgColor}" style="width:50%;"></td>
                                          <td width="70%">
                                             More than <span class="icon header population"> </span> <input type="input" class="defPackStackData_${data}" data-value="population" value="${userData.stack_data[data].population}">
                                          </td>
                                      </tr>`).join('')}
                                  </tbody>
                                  <thead>
                                      <th colspan="2"><img width="16px" src="${settings.images.attack}"> Incomings Stack Health Settings</th>
                                  </thead>
                                  <tbody>
                                   ${Object.keys(settings.standard.incomingStackData).filter(data => data !== 'NOK').map(data =>
                  `<tr>
                                          <td width="30%"><strong style="color: ${settings.standard.incomingStackData[data].color}">${settings.standard.incomingStackData[data].message}</strong></td>
                                          <td width="70%">
                                             More than <input type="input" class="defPackIncomingStackData_${data}" data-value="clears" value="${userData.incoming_stack_data[data].clears}"> Clears Surplus
                                          </td>
                                      </tr>`).join('')}
                                      ${Object.keys(settings.standard.incomingStackData).filter(data => data !== 'NOK').map(data =>
                  `<tr>
                                          <td width="30%"><input type="color" class="defPackIncomingStackData_${data}" data-value="bgColor" value="${userData.incoming_stack_data[data].bgColor}" style="width:50%;"></td>
                                          <td width="70%">
                                             More than <span class="icon header population"> </span> <input type="input" class="defPackIncomingStackData_${data}" data-value="population" value="${userData.incoming_stack_data[data].population}">
                                          </td>
                                      </tr>`).join('')}
                                  </tbody>
                                 <thead>
                                      <th colspan="2"><img src="${settings.images.settings}"> Simulator Stack Health Settings</th>
                                  </thead>
                                  <tbody>
                                      ${Object.keys(settings.stackHealth).map(setting =>
                  `<tr>
                                              <td colspan="2">${settings.stackHealth[setting].text} <input style="float: right" type="checkbox" id="${settings.stackHealth[setting].id}"></td>
                                          </tr>`).join('')}
                                  </tbody>
                              </table>
                              <table class="vis" style="width: 100%; display: none" data-setting="tagger">
                                  <thead>
                                      <th colspan="4"><img src="${settings.images.edit}"> Tagger Settings</th>
                                  </thead>
                                  <tbody>
                                  ${Object.keys(settings.standard.taggerData).map(data =>
                  `<tr>
                                          <td width="20%">${settings.standard.taggerData[data].message}</td>
                                          <td width="60%">
                                             <input style="width: 98%;" type="input" class="defPackTaggerData_${data}" data-type="tag" value="${userData.tagger_data[data].tag}">
                                          </td>
                                          <td width="10%">
                                             <input style="width: 90%;" type="input" class="defPackTaggerData_${data}" maxlength="1" data-type="shortKey" value="${userData.tagger_data[data].shortKey ?? ''}">
                                          </td>
                                          <td width="10%">
                                             <input style="width: 90%;" type="color" class="defPackTaggerData_${data}" data-type="color" value="${userData.tagger_data[data].color ?? '#efefef'}">
                                          </td>
                                      </tr>`).join('')}
                                  ${Object.keys(userData.custom_tagger_data).map(data =>
                  `<tr>
                                          <td width="20%">
                                              ${userData.custom_tagger_data[data].message} <img style="cursor: pointer; cursor: pointer; height: 12px; vertical-align: middle" src="graphic/delete.png" id="defPackRemoveCustomTaggerData_${data}" alt="">
                                          </td>
                                          <td width="60%">
                                             <input style="width: 98%;" type="input" class="defPackCustomTaggerData_${data}" data-type="tag" value="${userData.custom_tagger_data[data].tag}">
                                          </td>
                                          <td width="10%">
                                             <input style="width: 90%;" type="input" class="defPackCustomTaggerData_${data}" maxlength="1" data-type="shortKey" value="${userData.custom_tagger_data[data].shortKey}">
                                          </td>
                                          <td width="10%">
                                             <input style="width: 90%;" type="color" class="defPackCustomTaggerData_${data}" data-type="color" value="${userData.custom_tagger_data[data].color ?? '#efefef'}">
                                          </td>
                                      </tr>`).join('')}
                                  </tbody>
                              </table>
                              <table class="vis" style="width: 100%; display: none" data-setting="tagger">
                                  <thead>
                                      <th colspan="4"><img src="${settings.images.edit}"> Custom Tagger Messages</th>
                                  </thead>
                                  <tr>
                                      <td width="20%">Label</td>
                                      <td width="50%">Tag</td>
                                      <td width="15%">Short Key</td>
                                      <td width="10%">Color</td>
                                  </tr>
                                  <tr>
                                      <td width="20%"><input style="width: 80%;" type="input" id="defPackCustomTaggerMessage"></td>
                                      <td width="50%"><input style="width: 98%;" type="input" id="defPackCustomTaggerTag"></td>
                                      <td width="15%"><input style="width: 90%;" type="input" id="defPackCustomTaggerShortKey" maxlength="1"></td>
                                      <td width="10%"><input style="width: 90%;" type="color" id="defPackCustomTaggerColor" value="#efefef"></td>
                                  </tr>
                                  <tr>
                                      <td colspan="2"><button class="btn" id="defPackSaveTaggerCustomMessage">Add</button>
                                  </tr>
                              </table>
                      </tr>
                      </tbody>
                  </table>
                  </div>
              </div>`;
              Dialog.show('defPackSettings', html);

              $('.defPack_settingMenu').click(function () {
                  $('table[data-setting]').hide();
                  $(`[data-setting=${$(this).data('setting')}]`).show();
              });
              $('#defPackNightMode').prop('checked', userData.nightEnabled);
              $('#defPackDuplicatesChecker').prop('checked', userData.duplicatesCheckerEnabled);
              $('#defPackIncomingsOverviewEnhancements').prop('checked', userData.incomingsOverviewEnhancementEnabled);
              $('#defPackRequestOSEnhancements').prop('checked', userData.requestOSEnhancementEnabled);
              $('#defPackUseSanguTaggerSettings').prop('checked', userData.useSanguTaggerSettings);
              $('#defPackShowNextIncBrowserTab').prop('checked', userData.showNextIncBrowserTab);
              $('#defPackAddStackHealthMap').prop('checked', userData.addStackHealthMap);
              $('#defPackAddAdvancedTaggingInterfaceOnOverviewScreen').prop('checked', userData.addAdvancedTaggingInterfaceOnOverviewScreen);
              $('#defPackAddAdvancedTaggingInterfaceOnInfoVillageScreen').prop('checked', userData.addAdvancedTaggingInterfaceOnInfoVillageScreen);
              $('#defPackRestyleWidgetsOnOverviewScreen').prop('checked', userData.restyleWidgetsOnOverviewScreen);
              $('#defPackDisableDoubleCheckingIfSanguIsNotActive').prop('checked', userData.disableDoubleCheckingIfSanguIsNotActive);
              $('#defPackIgnoreScoutsInStackHealthCheck').prop('checked', userData.ignoreScoutsInStackHealthCheck);
              $('#defPackIgnoreOwnTroopsInStackHealthCheck').prop('checked', userData.ignoreOwnTroopsInStackHealthCheck);
              $(`#defPack_offFlagBoostSelect option[value="${userData.offFlag}"]`).attr('selected', 'selected');

              addInputChangeListenersOnSettingsPage();
          });
      }

      const addSnipeButton = (el) => {
          const arrivalTimes = $(el).text().trim().match(/(\d+.\d+.\d+)\s+(\d+:\d+:\d+:\d+)/g) ??  $(el).text().trim().match(/(\d+.\d+.\d+)\s+(\d+:\d+:\d+)/g);
          $(el).find('img[src*="attack"]').each((i, img) => {
              const targetSpan = $(img).prevAll('b:contains("Dorp:"):first').next('span');
              if (targetSpan.length) {
                  $(img).before(
                      `<img title="Snipe" class="defPack_snipePm" src="${settings.images.snipe}" style="cursor: pointer;" data-target=${targetSpan.data('id')} data-coords=${targetSpan.find('a:first').text().toCoord()} data-arrival-time="${arrivalTimes[i]}">`
                  );
                  $(img).before(
                      `<a style="margin-right: 2px; " target="_blank" href="${game_data.link_base_pure}place&mode=call&arrivalTime=${arrivalTimes[i]}&target=${targetSpan.data('id')}"><img title="Mass Support" src="${settings.images.support}" data-arrival-time="${arrivalTimes[i]}"></a>`
                  );
              }
          });
      }
      const addSnipeClickListener = () => {
          $('.defPack_snipePm').click(function () {
              openSnipeInterface($(this).data('coords'), $(this).data('arrival-time'), $(this).data('target'), true);
          })
      }
      const getIncomings = (villageId = game_data.village.id) => twLib.get({url: game_data.link_base_pure.replace(/village=\d+/, `village=${villageId}`) + 'overview'});
      const loadProductionOverview = (mode, group) => twLib.get({url: game_data.link_base_pure + 'overview_villages&mode=' + mode + '&group=' + (group || 0) + '&page=-1&'});
      const addWithdrawCheckboxSupportFunctionality = (id) => {
          const supportTroopSettings = JSON.parse(localStorage.getItem(settings.storageKeys.supportTroopSettings)) || game_data.units.map((u) => {
              return {unit: u, enabled: true}
          });
          const applyCheckboxProperties = () => {
              supportTroopSettings.forEach((s) => $(`.defPack_unitSelection[data-unit="${s.unit}"]`).prop('checked', s.enabled));
          }
          const applyZeroValuesToInputs = (checked, selector) => {
              if (checked) $('.defPack_unitSelection:checkbox:not(:checked)').map((_, u) => $(u).data('unit')).each((_, r) => $(selector).find(`.unit-item-${r} input`).val(0));
          }
          $(`#${id} .unit_link`).each((_, unit) => $(unit).after(`<input type="checkbox" class="defPack_unitSelection" data-unit=${$(unit).data('unit')}>`));
          applyCheckboxProperties();
          $('.defPack_unitSelection').change(function () {
              const unit = $(this).data('unit');
              const input = $(`.unit-item-${unit} input`);
              input.val(this.checked ? $(input).attr('max') : 0);
              supportTroopSettings.filter((u) => u.unit === unit)[0].enabled = this.checked;
              localStorage.setItem(settings.storageKeys.supportTroopSettings, JSON.stringify(supportTroopSettings));
          });
          $('.troop-request-selector').change(function () {
              applyZeroValuesToInputs(this.checked, $(this).closest('tr'));
          });
          $('.troop-request-selector-all').change(function () {
              applyCheckboxProperties();
              applyZeroValuesToInputs(this.checked, $(this).closest('tbody'));
          });
      }
      const getTotalIncomingOsData = async (villageId) => {
          return new Promise((resolve, reject) => {
              twLib.get({
                  url: `${game_data.link_base_pure.replace(/village=\d+/, `village=${villageId}`)}place&mode=call`,
                  success: function (html) {
                      resolve($(html).find('#support_sum')[0].outerHTML)
                  }, error: function (error) {
                      reject(error);
                  }
              })
          });
      }
      const getIncomingSupportDataFor = (command) => twLib.get({
          url: `${game_data.link_base_pure}info_command&ajax=details&id=${command}`,
          async: false
      }).then((response) => response.units);
      const getTechLevelsFor = (page) => twLib.get({
          url: `${page}`,
          async: false
      }).then((response) => {
          techLevels = {};
          const unitIndexes = game_data.units.map((u) => {
              return {unit: u, index: $(response).find('#techs_table tbody tr:first').find(`img[src*=${u}]`).closest('th').index()}
          }).filter((unit) => unit.index > -1);
          $(response).find('#techs_table .row_a,#techs_table .row_b').each((_, row) => {
              const villageId = $(row).find('.quickedit-vn').data('id');
              const unitTechLevels = {};
              unitIndexes.forEach((unit) => unitTechLevels[unit.unit] = parseInt($(row).find(`td:eq(${unit.index}) > span:first`).text()) || 0);
              techLevels[villageId] = unitTechLevels;
          });
          return techLevels;
      })
      const cachePlayerTechLevels = async (html = document) => {
          const mapHref = () => (_, page) => $(page).attr('href');
          const isAllPagesSelected = $('#paged_view_content table', html).find('strong:contains("alle")');
          const page = window.location.href.indexOf('tech') !== -1 ? window.location.href : settings.tech.url;
          const pages = isAllPagesSelected.length > 0 ? isAllPagesSelected.closest('td').find('.paged-nav-item').map(mapHref()).get()
              : [page, ...$('.paged-nav-item:not(:last)', html).map(mapHref())];

          let data = {};
          for (let page of pages) {
              data = {...data, ...await getTechLevelsFor(page)}
          }
          localStorage.setItem(settings.storageKeys.techLevels, JSON.stringify(data));
      }
      const assembleNewCommand = (command, textFromTagger) => {
          const unit = settings.reservedWords.find(word => command.text.toUpperCase().indexOf(word.toUpperCase()) !== -1);
          const extractDuplicates = command.text.match(/\[[D]#\d+]/)?.pop() ?? '';
          const extractTribeShare = command.text.match(/#\w+#(?:$|\s+)\[\d+%]|#\w+#/)?.pop() ?? '';
          const extractIncEnhancer = command.text.match(/\[[S]#\d+]|\[\*\w+\*]/)?.pop() ?? '';
          let newCommand = textFromTagger;
          if (unit) {
              newCommand = `${unit} ${textFromTagger}`;
          }
          newCommand += ` ${extractTribeShare} ${extractDuplicates} ${extractIncEnhancer}`;
          return newCommand;
      }
      const renameIncomings = (allIncomings, taggerSettings, customTaggerText) => {
          const textFromTagger = $('#defPack_overviewTaggerText').val();
          allIncomings.find(':checkbox:first:checked').closest('tr').map((_, u) => {
              return {
                  text: $(u).find(`span.quickedit-label`).text().trim(),
                  id: $(u).find('.quickedit').data('id'),
                  taggedSpan: $(u).find('.defPackCommandTagged')
              }
          }).get().forEach((command) => {
              renameCommandWithTagSetting(command, assembleNewCommand(command, customTaggerText ?? textFromTagger), taggerSettings);
          });
      }
      const getTaggerButtons = (taggerSettings) => {
          return Object.keys(taggerSettings)
              .map(data => {
                  const borderColor = `${taggerSettings[data].color !== undefined && taggerSettings[data].color !== '#efefef' ? taggerSettings[data].color : ''}`;
                  return `<input class="defPackRenameButton" type="button" style="cursor: pointer; font-weight: bold; margin-right: 1px; border-color: ${borderColor}" data-rename-to="${taggerSettings[data].tag}" value="${taggerSettings[data].message} ${taggerSettings[data].shortKey ? `(${taggerSettings[data].shortKey})` : ''}"/>`;
              });
      }
      const addHotKeyRenameCommandOnHover = (taggerSettings, hoverSelector) => {
          const setHoverBindings = (row, taggerSettings) => {
              HotKeys.locked = true;

              $(document).off().on('keydown.defpack', function (event) {
                  const tagByShortKey = Object.values(taggerSettings).find((e) => e.shortKey === String.fromCharCode(event.keyCode).toLowerCase());
                  if (tagByShortKey) {
                      const commandQe = $(row).find('.quickedit');
                      const command = {
                          id: $(commandQe).attr('data-id'),
                          text: $.trim($(commandQe).find('span.quickedit-label').text()),
                          taggedSpan: $(row).find('.defPackCommandTagged')
                      }
                      renameCommandWithTagSetting(command, assembleNewCommand(command, tagByShortKey.tag), taggerSettings);
                  }
              });
          };

          const clearHoverBindingsBindings = () => {
              HotKeys.locked = false;
              HotKeys.init();
              $(document).off('keydown.defpack').off('keyup.defpack');
          }

          $(hoverSelector).hover(function () {
              setHoverBindings($(this), taggerSettings);
          }, () => clearHoverBindingsBindings());
      }
      const insertRenameButtons = (incomingsTable, taggerSettings) => {
          if (!$('#commands_incomings .selectAll').length) {
              $('#show_incoming_units,#commands_incomings .command-row:last').after(
                  `<tr id="ignored_commands_bar">
                          <th colspan="5"><input name="all" type="checkbox" class="selectAll" onclick="selectAll(this.form, this.checked)"> alles selecteren</th>
                      </tr>`
              );
              $('.command-row .quickedit').each((_, el) => $(el).parent().prepend(`<input name="id_${$(el).data('id')}" type="checkbox">`));
          }
          const allIncomings = incomingsTable.find('tr.command-row.no_ignored_command');
          const allAttackIncomings = allIncomings.find('span img[src*="attack"]').closest('tr');
          const allSupportIncomings = allIncomings.find('span img[src*="support"]').closest('tr');
          if (allAttackIncomings.length) {
              incomingsTable
                  .find('table:first tr:first')
                  .before(`
                              <tr>
                                  <th colspan="6">Tagging</th>
                              </tr>
                              <tr>
                                  <td colspan="6" id="defPackVillageTaggerSettings">
                                  ${getTaggerButtons(taggerSettings).join('')}
                                  | <input type="text" id="defPack_overviewTaggerText" name="Tag" value="OK"> <a id="defPack_overviewTaggerBtn" style="margin-top: 5px" class="btn">Tag</a>
                                  </td>
                              </tr>
                          `);
              allAttackIncomings
                  .find('.quickedit')
                  .each((_, el) => {
                      const commandText = $(el).find('.quickedit-label').text().trim();
                      const taggingSetting = Object.values(taggerSettings).find((setting) => commandText.includes(setting.tag));
                      $(el).before(`<span class="defPackCommandTagged" style="display: inline-block; border: 1px solid black; width: 10px; height: 10px; background-color: ${taggingSetting?.color ?? '#efefef'}; border-radius: 50%"></span>`)
                  })

              $('.defPackRenameButton').hover(function () {
                  $(this).css('filter', 'brightness(125%)');
              }).mouseout(function () {
                  $(this).css('filter', '');
              }).click(function () {
                  renameIncomings(allIncomings, taggerSettings, $(this).data('rename-to'));
              });
              const selectionTypes = {
                  today: {
                      text: `<img src="${settings.images.attack}"> vandaag`,
                      selector: allAttackIncomings.find('td:contains("heute")').closest('tr').find(':checkbox:first')
                  },
                  tomorrow: {
                      text: `<img src="${settings.images.attack}"> morgen`,
                      selector: allAttackIncomings.find('td:contains("morgen")').closest('tr').find(':checkbox:first')
                  },
                  attack: {
                      text: `<img src="${settings.images.attack}">`,
                      selector: allAttackIncomings.find(':checkbox:first')
                  },
                  support: {
                      text: `<img src="${settings.images.support}">`,
                      selector: allSupportIncomings.find(':checkbox:first')
                  },
                  snob: {
                      text: `<img src="graphic/command/snob.png">`,
                      selector: allAttackIncomings.find('img[src*="snob.png"]').closest('tr').find(':checkbox:first')
                  },
              }
              $('.selectAll:first')
                  .parent('th')
                  .append(`${Object.keys(selectionTypes).map((type) => `<input type="checkbox" class="defPackIncomingSelection" data-type="${type}">${selectionTypes[type].text}`).join(' | ')}`);

              const activateSelectionType = (element, type, checked) => {
                  Object.entries(selectionTypes)
                      .forEach(([key, value]) => value.selector.prop('checked', false) && $(`.defPackIncomingSelection[data-type="${key}"]`).prop('checked', false));
                  selectionTypes[type].selector.prop('checked', checked);
                  $(element).prop('checked', checked);
              }

              const savedSelectionType = userData.activeSelectionType;
              if (savedSelectionType) {
                  activateSelectionType($(`.defPackIncomingSelection[data-type="${savedSelectionType}"]`), savedSelectionType, true);
              }
              $('.defPackIncomingSelection').click(function () {
                  const type = $(this).data('type');
                  const checked = $(this).is(':checked');

                  activateSelectionType($(this), type, checked);
                  userData.activeSelectionType = checked ? type : null;
                  localStorage.setItem(settings.storageKeys.defPackSettings, JSON.stringify(userData));
              })
              $('#defPackVillageTaggerSettings input').click(function () {
                  $('#defPack_overviewTaggerText').val($(this).data('rename-to'));
              });
              $('#defPack_overviewTaggerBtn').click(function () {
                  renameIncomings(allIncomings, taggerSettings);
              });
          }
      }
      const restyleWidgets = () => {
          $('#show_am_settings').after($('#show_buildqueue'));
          $('#overviewtable').append('<tbody><tr class="newLayoutTR"><td colspan="2"><div class="outerBorder newLayout"></div></td></tr></tbody>');
          $('.newLayout')
              .append($('#incoming_os_sum_table'))
              .append($("#show_incoming_units"))
              .append($("#show_outgoing_units"))
              .find('table').not('#incoming_os_sum_table,#support_sum').each((_, element) => $(element).find('tr').eq(0).find('th').eq(0).attr('width', '70%'));

          let $ignoreTR = $('input[value="Negeren"]').closest('tr');
          if ($ignoreTR.length > 0) {
              $ignoreTR.prev('tr').find('th').first().append('<span style="float:right;">' + $ignoreTR.find('td').html() + '</span>');
              $ignoreTR.remove();
          }

          $('.newLayoutTR').after('<tr><td valign="top" id="leftcolumn" class="newLeftColomn" width="612"></td> <td valign="top" id="rightcolumn" class="newRightColomn" width="612"></td></tr>');

          let widgetsR = $('#leftcolumn #show_event').add($('#rightcolumn').find('.widget')),
              overview_height = $('#show_summary').height(), height_count = 0, x = 0;
          for (let i = 0, l = widgetsR.length; i < l; i++) {
              const widget = widgetsR.eq(i);
              const height = (parseInt(widget.height()) + 15);

              if (((height_count + height) > overview_height) && (!widget.find('.head:contains("Eenheden")').length) || widget.is("#show_event")) {
                  $(`${Math.floor((widgetsR.length - (i + 1)) / 2) < x ? '.newLeftColomn' : '.newRightColomn'}`).prepend(widget);
                  x++;
              }
              height_count = height_count + height;
          }
          const mood = $('#show_mood span:last')
          if ($(mood).is(":visible")) {
              $('#defPack_stackSurplus').after(`<tr><td>Zustimmung: ${mood[0].outerHTML}</td></tr>`);
          }
      }
      const makeCompatibleWithToxicDonutIncEnhancer = () => {
          if ($('#playerNames').length) {
              $('[data-group="defPack_incsWallUnder20"], [data-group="defPack_customerTagger"], .defPack_retrieveStackHealth').remove();
          }
      }

      $('#incomings_cell a').attr('href', game_data.link_base_pure + 'overview_villages&mode=incomings&subtype=attacks&page=-1&group=0');
      const mode = game_data.mode ?? new URLSearchParams(window.location.search).get('mode');
      switch (game_data.screen) {
          case 'info_village':
              $('#commands_outgoings tr:first th:last, #commands_incomings tr:first th:last').after('<th>Snipe</th>')
              $('.command-row').each((i, el) => {
                  $(el).find('td:last').after(`<td style="text-align: center"><img class="defPack_snipeFinder" style="cursor: pointer" src="${settings.images.snipe}"/></td>`);
              })

              $('.defPack_snipeFinder').click(function () {
                  const tr = $(this).closest('tr');
                  const villageToBeSniped = $('table.vis td:eq(2)').text()?.toCoord() ?? $('.mobileKeyValue div:first span:eq(1)').text().toCoord();
                  const targetId = $('#template_form a').attr('href').match(/target=(\d+)/).pop();
                  const twDate = tr.find('td:eq(1)').text().trim();

                  openSnipeInterface(villageToBeSniped, twDate, targetId, true);
              });
              const taggerSettings = getTaggerSettings();
              if (userData.addAdvancedTaggingInterfaceOnInfoVillageScreen) {
                  insertRenameButtons($('#commands_incomings'), taggerSettings);
              }
              addHotKeyRenameCommandOnHover(taggerSettings, '#commands_incomings tr.command-row.no_ignored_command');
              addWithdrawCheckboxSupportFunctionality('withdraw_selected_units_village_info');
              break;
          case 'mail':
              if ('view' === mode) {
                  $('.text').each((i, el) => {
                      addSnipeButton(el);
                  });
                  addSnipeClickListener();
              }
              break;
          case 'memo':
              $('.memo_container:visible .show_row td').each((i, el) => {
                  addSnipeButton(el);
              });
              addSnipeClickListener();
              break;
          case 'forum':
              $('.text').each((i, el) => {
                  addSnipeButton(el);
              });
              addSnipeClickListener();
              break;
          case 'overview_villages':
              const searchParams = new URLSearchParams(window.location.search);
              if (searchParams.get('mode')?.toLowerCase() === 'incomings' && ['attacks', 'shared'].includes(searchParams.get('subtype')?.toLowerCase())) {
                  if ($('#incomings_table').length && userData.incomingsOverviewEnhancementEnabled) {
                      $(document).ajaxComplete(function (event, xhr, settings) {
                          if (settings.url.indexOf('partial') > -1) {
                              addEnhancedIncomingsTable();
                          }
                      });
                      addEnhancedIncomingsTable();
                  }
              } else if ('tech' === mode && config?.worldSettings?.tech === settings.tech.LEVELS) {
                  cachePlayerTechLevels();
              }
              break;
          case 'overview':
              const isSanguActive = localStorage.getItem('sangu_sanguActive') === 'true' && $('#sangu_activator').length > 0;
              const incomingsTable = $('#commands_incomings');
              const anyCommandsNotIgnored = $(incomingsTable).find('.no_ignored_command');
              const allIncomings = incomingsTable.find('tr.command-row.no_ignored_command');
              const wall = game_data.village.buildings.wall || 0;
              const stackCheckerSettings = {
                  initialWall: wall,
                  wallParam: `&def_wall=${wall}`
              };

              const simulationUrl = await buildSimulationUrl(document, stackCheckerSettings.wallParam, game_data.village.id);
              twLib.get({url: `${simulationUrl}`, dataType: 'html'}).then((response) => {
                  stackCheckerSettings.clearsNeeded = $(response).find('#content_value').find('p').css('font-style', 'italic').find('b').text();
                  stackCheckerSettings.postClear = parseInt($(response).find('th:contains("Schaden durch Rammböcke:")').next().find('b:last-child').text())
                  stackCheckerSettings.totalPopFromSimulation = $(response).find('td:contains("Verteidiger")').closest('tr').find('td:last').first().text();

                  const data = configureHealthCheckValues(stackCheckerSettings, allIncomings);
                  const html =
                      `<div id="defPack_stackChecker" class="vis moveable widget">
              <h4 class="head with-button">DEF-Stärke: <strong style="color: ${data.color}">${data.message}</strong></h4>
              <div class="widget_content" style="display: block">
                  <table style="width: 100%">
                      <tbody>
                          <tr>
                              <td>
                                  DEF:<strong> ${(stackCheckerSettings.clearsNeeded.indexOf('meer dan 100') !== -1 ? stackCheckerSettings.clearsNeeded : (data.clears))}</strong> Angriff(e)
                              </td>
                          </tr>
                          <tr>
                              <td>
                                   <strong>#1</strong> <img style="vertical-align: bottom;" src="graphic/unit/unit_ram.png" title="" alt="" class="">
                                  <img src="graphic/buildings/wall.png" title="" alt=""> <strong>${stackCheckerSettings.initialWall}</strong> -> <strong style="color: ${data.color}"> ${(isNaN(stackCheckerSettings.postClear) ? stackCheckerSettings.initialWall : stackCheckerSettings.postClear)}</strong>
                              </td>
                          </tr>
                          ${allIncomings.length ?
                          `<tr>
                              <td>Eintreffed: ${data.totalAttacks}</td>
                          </tr>
                          <tr id="defPack_stackSurplus">
                              <td>DEF hält noch: <strong style="color: ${data.surplus > 0 ? 'black' : 'red'}">${data.surplus}</strong> weitere Angriffe</td>
                          </tr>`
                          : ''}
                          <tr><td><small><a href='${simulationUrl}' target="_blank">Simulationsergebnis</a></small></td></tr>
                          <tr>
                              <td style="border-top: 1px solid #85550d; background-color: ${data.stackColor}"><span class="icon header population"> </span> <strong><a style="color:black" href="${game_data.link_base_pure}place&mode=units">${stackCheckerSettings.totalPopFromSimulation}</a></strong></td>
                          </tr>
                      </tbody>
                  </table>
              </div>
          </div>`;
                  $('#show_buildqueue').after(html);
                  if (data.message === 'NOK') {
                      $('#defPack_stackChecker').css('border', `2px solid ${data.color}`)
                  }
                  let arrivalIndex = -1;
                  if (isSanguActive) {
                      incomingsTable.find('tr:eq(1) th:last').after(`<th><a class="btn" title="Add Stack Health to command" id="defPackAddPopToCommand">Add <span class="icon header population"></span></a></th>`);
                      $('td[colspan="4"], td[colspan="5"]').attr('colspan', 6);
                      $('#slowestUnitCell').attr('colspan', 2);
                      arrivalIndex = $('th:contains("Aankomst")').index();
                  } else {
                      incomingsTable.find('tr:first th:last').after(`<th><a class="btn" title="Add Stack Health to command" id="defPackAddPopToCommand">Add <span class="icon header population"></span></a></th>`);
                      $('td[colspan="3"], td[colspan="4"], th[colspan="4"]').attr('colspan', 5);
                      arrivalIndex = $('th:contains("Aankomst")').index();
                  }
                  allIncomings.each(function () {
                      const arrivalTime = $(this).find(`td:eq('${arrivalIndex}')`).text().trim();
                      $(this).find('.quickedit').before(
                          `<img title="Snipe" class="defPack_snipePm" src="${settings.images.snipe}" style="margin-right: 5px; cursor: pointer;" data-target=${game_data.village.id} data-coords=${game_data.village.coord} data-arrival-time="${arrivalTime}" alt="">`
                      );
                      const lastTd = $(this).find('td:last');
                      if ($(this).find('span img[src*="attack"]').length > 0) {
                          $(lastTd).after(`
                              <td style="text-align: center">
                                  <input type="checkbox" class="defPackAddPopToCommand" checked>
                              </td>`
                          );
                      } else {
                          $(lastTd).after(`<td></td>`);
                      }
                  });
                  const taggerSettings = getTaggerSettings();

                  addSnipeClickListener();
                  addHotKeyRenameCommandOnHover(taggerSettings, '#commands_incomings tr.command-row.no_ignored_command');

                  $('#defPackAddPopToCommand').click(function () {
                      let checkedInputs = $('.defPackAddPopToCommand:checked');
                      checkedInputs.each(function () {
                          let commandId = $(this).closest('tr').find('span img[src*="attack"]').parent().attr('data-command-id');
                          let commandMessage = $.trim($('span.quickedit[data-id="' + commandId + '"]').find('span.quickedit-label').text());
                          const incomingCommands = $('#commands_incomings tr.command-row.no_ignored_command');
                          let totalClears = incomingCommands.find('img[src*="attack"]').closest('tr').not(':has(img[src*="snob"])').length;
                          let totalSnobs = incomingCommands.find('img[src*="snob"]').length;

                          if (commandMessage.indexOf('(Stack = ') === -1) {
                              renameCommand(commandId, commandMessage + ' - (Stack = ' + recalculateClearsNeeded(stackCheckerSettings) + 'C => ' + totalClears + ' C/' + totalSnobs + ' N)');
                          } else if (commandMessage.indexOf('(Stack = ') > -1) {
                              renameCommand(commandId, commandMessage.replace(commandMessage.split('Stack = ')[1], recalculateClearsNeeded(stackCheckerSettings) + 'C => ' + totalClears + ' C/' + totalSnobs + ' N)'));
                          }
                      })
                  })

                  if (incomingsTable.length && userData.addAdvancedTaggingInterfaceOnOverviewScreen && anyCommandsNotIgnored.length && userData.restyleWidgetsOnOverviewScreen) {
                      const autoExecutedQuickBarEntries = JSON.parse(localStorage.getItem(`TWextension_quickbarList_${game_data.player.id}`)) ?? [];
                      if (userData.disableDoubleCheckingIfSanguIsNotActive || !autoExecutedQuickBarEntries.length) {
                          insertRenameButtons(incomingsTable, taggerSettings);
                          restyleWidgets();
                      } else if (!isSanguActive) {
                          // Double check if sangu is not auto executed anyway. We have to check this because of loading priority
                          const autoExecutedQuickBarEntriesPromises = autoExecutedQuickBarEntries
                              .map((hash) => {
                                  return new Promise((resolve, _) => {
                                      twLib.get({
                                          url: `${game_data.link_base_pure}api&ajax=quickbar_entry&hash=${hash}`,
                                          async: true,
                                          success: (data) => resolve(data.entry.toLowerCase())
                                      });
                                  })
                              });
                          Promise.all(autoExecutedQuickBarEntriesPromises).then(quickBarContent => {
                              const sanguAutoExecuted = [...quickBarContent].some((content) => content.includes('sangu-package'));
                              if (!sanguAutoExecuted) {
                                  insertRenameButtons(incomingsTable, taggerSettings);
                                  restyleWidgets();
                              }
                          });
                      }
                  }
              });
              break;
          case 'place':
              if (game_data.mode === null && new URLSearchParams(window.location.search).get('type') === 'snipe') {
                  loadSnipeSettings();
                  Array.from(snipeSettings.units).filter((u) => u.enabled && u.amount > 0).forEach((t) => $(`#unit_input_${t.unit}`).val(t.amount));
              }
              if (mode === 'call' && userData.requestOSEnhancementEnabled) {
                  const searchParams = new URLSearchParams(window.location.search);
                  // OCD center everything!
                  $('#support_sum').css('text-align', 'center');
                  $('.call-village').each((i, r) => $(r).find('a').closest('td').prepend(`<strong>#${i + 1} | </strong>`));
                  $('.evt-button-fill').after(`
              | <input type="checkbox" id="defPack_selectVillagesCheckBox"/>
              Selecteer <input style="width: 10%" type="number" min="0" id="defPack_selectVillages" value="${localStorage.getItem(settings.storageKeys.selectVillages) || 0}"/> Dorpen
              | <input type="button" class="btn btn-default" style="${searchParams.get('sources') ? '' : 'display:none'}" id="defPack_selectVillagesFromUrl" value="Selecteer (${searchParams.get('sources')?.split(',').length}) Massa Dodge Dorpen"/>
          `);
                  $('#defPack_selectVillagesCheckBox').off().on('click', function () {
                      const villagesToSelect = $('#defPack_selectVillages').val();
                      localStorage.setItem(settings.storageKeys.selectVillages, villagesToSelect);
                      $(`.troop-request-selector:lt(${villagesToSelect})`).prop('checked', this.checked).trigger('change');
                  });
                  $('#defPack_selectVillagesFromUrl').click(() => {
                      searchParams.get('sources').split(',').forEach((source) => $(`#call_village_${source} .troop-request-selector`).prop('checked', true).trigger('change'));
                  });
                  $(window).bind('load', function () {
                      $('.evt-button-fill').click(() => calculateSupportPopulationPreview());
                  });

                  const unitsInTable = $('#support_sum tbody tr:first td').map(function () {
                      return $(this).data('unit');
                  }).get();
                  const getCustomArrivalTime = (element) => {
                      // dd.mm.yyyy hh:MM:ss:SSS support
                      // Aankomsttijd: 27.11.20 20:09:32:959
                      const matchDateFormat = element.val().match(/(\d+.\d+.\d+)\s+(\d+:\d+:\d+:\d+)/);
                      let timeTobeSnipedAt = convertToDate(element.val());

                      if (matchDateFormat) {
                          const matchDateFormatElement = matchDateFormat[0];
                          // Check if date is formatted as dd.mm.yy not dd.mm.yyyy
                          if (matchDateFormatElement.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/g)) {
                              timeTobeSnipedAt = new Date(matchDateFormatElement.replace(/(\d{1,2})\.(\d{1,2})\.(\d{4})/g, '$3-$2-$1'));
                          } else {
                              timeTobeSnipedAt = new Date(new Date().getFullYear() + '-' + matchDateFormatElement.replace(/(\d{1,2})\.(\d{1,2})\.(\d{1,4})/g, '$2-$1'));
                          }
                      }
                      return timeTobeSnipedAt / 1000;
                  }

                  $('#place_call_form').before(`
              <div id="defPack_requestSupportEnhancements" class="vis" style="display: none">
                  <h3 style=" text-align: center;"> Preview OS - Selected <b>0</b> villages</h3>
                  <table id="defPack_requestOSTable" class="vis overview_table" width="100%" style="text-align: center;">
                      <thead>
                          <tr>
                              ${Object.keys(unitsInTable).map(unit =>
                      `<th style="text-align:center" width="35"><a href="#" class="unit_link" data-unit="${unitsInTable[unit]}"><img src="/graphic/unit/unit_${unitsInTable[unit]}.png"></a></th>`
                  ).join('')}
                              <th class="center" style="width: 35px" title="Bevolking">
                                  <span class="icon header population"> </span>
                              </th>
                          </tr>
                      </thead>
                      <tbody>
                      </tbody>
                  </table>
          `);

                  $(document).on('change', '.troop-request-selector', function () {
                      const selectedVillagesLength = $("#village_troup_list tr:not(:first) input[type=checkbox]:checked").length;
                      $('#defPack_requestSupportEnhancements h3 b').text(`${selectedVillagesLength}`);
                      calculateSupportPopulationPreview();
                      if (selectedVillagesLength <= 0) $('#defPack_requestSupportEnhancements').hide(); else $('#defPack_requestSupportEnhancements').show();
                  });
                  $('#village_troup_list tbody tr td input').on('input', () => calculateSupportPopulationPreview());
                  $('.unit_checkbox').change(function () {
                      filterVillages(getSlowestUnit(), parseInt($('#defPack_incomingsSelection').val()) || getCustomArrivalTime($('#defPack_incomingsCustomDateSelection')));
                  });
                  $.when(getIncomings(new URLSearchParams(window.location.search).get('target'))).done(function (html) {
                      const validateInput = () => {
                          const snipeTime = $('#defPack_incomingsCustomDateSelection');

                          const invalidInputs = !snipeTime.val().match(/(\d+.\d+.\d+)\s+(\d+:\d+:\d+:\d+)/);
                          $('#defPack_incomingsCustomDateButton').prop('disabled', invalidInputs);
                      }

                      const rows = $(html).find('.no_ignored_command img[src*="attack"]').map(function () {
                          return $(this).closest('tr');
                      }).get();

                      const selectedVillageToOs = $('.village-name').text().toCoord();

                      $('#place_call_form table').before(`
                      <table id="defPack_callScreenTable" class="vis" width="100%">
                          <tbody>
                              <tr>
                                  <th width="75%" colspan="6">
                                      <input type="checkbox" id="defPack_callScreenFilterVillages" title="Filter all unusable villages">
                                      Verberg dorpen met een te lange looptijd
                                  </th>
                              </tr>
                          <tr></tr>
                          </tbody>
                      </table>`);

                      if (rows.length > 0 && selectedVillageToOs.length) {
                          const selectOptions = createOptions(rows);

                          $('#defPack_callScreenTable th').append(`<select style="margin-left: 6px; display: none" id="defPack_incomingsSelection">${selectOptions}</select>`);
                          const incomingSelection = $('#defPack_incomingsSelection');
                          $('#defPack_callScreenFilterVillages').change(() => incomingSelection.toggle() && filterVillages(getSlowestUnit(), parseInt(incomingSelection.val())));
                          incomingSelection.change(() => filterVillages(getSlowestUnit(), parseInt(incomingSelection.val())));
                      } else {
                          $('#defPack_callScreenTable th').append(`
                      <input id="defPack_incomingsCustomDateSelection" value="${localStorage.getItem(settings.storageKeys.dateSelection) || ''}" style="margin-left: 6px; display: none; width: 200px" class="toggle-it" type="text" placeholder="dd.mm.yyyy hh:mm:ss:SSS"/>
                      <input id="defPack_incomingsCustomDateButton" style="display: none" class="btn toggle-it" value="Filter">
                  `);
                          validateInput();
                          $('#defPack_incomingsCustomDateSelection').on('keyup', validateInput);

                          $('#defPack_incomingsCustomDateButton').click(function () {
                              const dateInput = $('#defPack_incomingsCustomDateSelection');
                              localStorage.setItem(settings.storageKeys.dateSelection, dateInput.val());
                              filterVillages(getSlowestUnit(), getCustomArrivalTime(dateInput));
                          });

                          $('#defPack_callScreenFilterVillages').change(() => $('.toggle-it').toggle());
                      }

                      const searchParams = new URLSearchParams(window.location.search);
                      const arrivalTime = searchParams.get('arrivalTime');
                      if (arrivalTime) {
                          $('#defPack_incomingsCustomDateSelection').val(arrivalTime);
                          localStorage.setItem(settings.storageKeys.dateSelection, arrivalTime);
                          validateInput();
                          $('#defPack_callScreenFilterVillages, #defPack_incomingsCustomDateButton').click();
                      }
                  });
              } else if (mode === 'units') {
                  $('#units_home input:checkbox').prop('checked', true);
                  addWithdrawCheckboxSupportFunctionality('units_away');
                  $('#units_home tbody tr:nth-child(n+3):not(:nth-last-child(-n+2))').sort(function (a, b) {
                      return parseFloat($(a).find('td:eq(2)').text()) > parseFloat($(b).find('td:eq(2)').text()) ? 1 : -1;
                  }).appendTo('#units_home tbody');
                  // Append the last 2 rows of the original table
                  $('#units_home tbody tr:nth-child(n+3):nth-child(-n+4)').appendTo('#units_home tbody');

                  const villages = $('#units_home a[href*="screen=info_village"]').map(function () {
                      return $(this).attr('href').match(/id=(\d+)/)[1]
                  }).get();

                  if (villages.length > 0) {
                      $.when(loadProductionOverview('prod')).done(function (html) {
                          const villagesUnderAttack = $(html).find('#production_table img[src*="graphic/command/attack.png"]').map(function () {
                              return $(this).closest('*[data-id]').attr('data-id');
                          }).get();

                          villages
                              .filter(village => villagesUnderAttack.includes(village))
                              .forEach((vil) => $(`span[data-id="${vil}"] a:first`).prepend(`<img src="graphic/command/attack.png" alt="" title="Under Attack!"> `));
                      });
                  }
              }
              break;
          case 'map':
              const mapTaggerSettings = getTaggerSettings();

              const mapTaggerHtml =
                  `
              <table id="defPack_mapTaggerSettings" class="vis" style="width: 100%;">
                  <thead>
                      <tr><th colspan="3">Map Utilities <small>- Devil's Def Pack <span style="color: darkblue">v${settings.version}</span></small></th></tr>
                  </thead>
                  <tbody>
                      <tr><td><input type="checkbox" id="defPack_mapTagger"></td><td style="cursor:pointer;" colspan="2">Gebruik Map Tagger</td></tr>
                      <tr class="defPack_mapTaggerTr" style="display: none">
                          <td>Villages</td>
                          <td>
                              <textarea id="defPack_mapTaggerTextArea" disabled rows="5" style="width: 97%;"></textarea>
                          </td>
                      </tr>
                      <tr class="defPack_mapTaggerTr" style="display: none">
                          <td>Tag</td>
                          <td>
                              ${Object.keys(mapTaggerSettings).map(data =>
                      `<button data-rename-to="${mapTaggerSettings[data].tag}">${mapTaggerSettings[data].message}</button>`)
                      .join('')}
                              <br>
                              <input type="text" id="defPack_mapTaggerText" name="Tag">
                              <a id="defPack_mapTaggerBtn" class="btn">Tag!</a>
                              <div id="defPack_mapTaggingProgressBar" class="progress-bar live-progress-bar progress-bar-alive" style="display: none">
                                  <div></div>
                                  <span class="label"></span>
                              </div>
                          </td>
                      </tr>
                      <tr><td><input type="checkbox" id="defPack_mapMassSupport"></td><td style="cursor:pointer;" colspan="2">Gebruik Massa Dodge</td></tr>
                      <tr class="defPack_mapDodgerTr" style="display: none">
                          <td>Villages</td>
                          <td>
                              <textarea id="defPack_mapDodgerTextArea" disabled rows="5" style="width: 97%;"></textarea>
                          </td>
                      </tr>
                      <tr class="defPack_mapDodgerTr" style="display: none">
                          <td><img src="/graphic/buildings/place.png"></td>
                          <td>
                              <a id="defPack_mapMassSupportLink" href="#" target="_blank">Open Massa Ondersteunen scherm</a>
                          </td>
                      </tr>
                  </tbody>
              </table>
          `;
              $('#map_search').before(mapTaggerHtml);

              $('#defPack_mapTagger').click(function () {
                  $('.defPack_mapTaggerTr').toggle();
                  commandsToRename.clear();
                  TWMap.reload();
                  refreshCoordList(new Set());
              });
              $('#defPack_mapMassSupport').click(function () {
                  $('.defPack_mapDodgerTr').toggle();
                  TWMap.reload();
                  refreshCoordList(new Set(), 'defPack_mapDodgerTextArea');
              });
              $('#defPack_mapTaggerBtn').click(function () {
                  renameCommandsWithProgressBar([...commandsToRename], 'mapTaggingProgressBar', 'mapTaggerText');

                  commandsToRename.clear();
                  TWMap.reload();
              });

              $('#defPack_mapTaggerSettings button').click(function () {
                  $('#defPack_mapTaggerText').val($(this).data('rename-to'));
              });

              let DS_Map = TWMap;
              DS_Map.map._DShandleClick = DS_Map.map._handleClick;

              let commandsToRename = new Set();
              let sources = new Set()
              TWMap.map._handleClick = function (e) {
                  if ($('#defPack_mapMassSupport').is(':checked')) {
                      const pos = this.coordByEvent(e);
                      const coord = pos.join("|");
                      const sourceId = TWMap.villages[(pos[0]) * 1000 + pos[1]].id;

                      if (Array.from(sources.values(), c => c.coords).includes(coord)) {
                          $('div').remove(`#defPack_villageOverLay_${sourceId}`);
                          sources.forEach(source => {
                              if (source.coords === coord) {
                                  sources.delete(source);
                              }
                          });
                      } else {
                          const mapVillageImage = $(`[id="map_village_${sourceId}"]`);
                          const mapVillageOverlay = {
                              id: 'defPack_villageOverLay_' + sourceId,
                              css: {
                                  'zIndex': '50',
                                  'position': 'absolute',
                                  'opacity': '0.3',
                                  'width': (TWMap.map.scale[0] - 1).toString() + 'px',
                                  'height': (TWMap.map.scale[1] - 1).toString() + 'px',
                                  'background': 'blue',
                                  'left': mapVillageImage.css('left'),
                                  'top': mapVillageImage.css('top')
                              }
                          };
                          mapVillageImage.after($("<div>", mapVillageOverlay));
                          sources.add({coords: coord, id: sourceId});
                      }
                      refreshCoordList(sources, 'defPack_mapDodgerTextArea');
                      return false;
                  } else if ($('#defPack_mapTagger').is(':checked')) {
                      const pos = this.coordByEvent(e);
                      const coord = pos.join("|");
                      const villageData = TWMap.villages[(pos[0]) * 1000 + pos[1]];

                      if (villageData) {
                          $.when(getIncomings(villageData.id)).done(function (html) {
                              const commands = $(html).find('.no_ignored_command img[src*="attack"]')
                                  .map((_, el) => {
                                      const row = $(el).closest('tr');
                                      return {
                                          id: $(row).find('[data-id]').data('id'),
                                          text: $(row).closest('td').find('.quickedit-label').text().trim(),
                                          coords: coord
                                      }
                                  }).get();

                              if (commands.length > 0) {
                                  if (Array.from(commandsToRename.values(), c => c.coords).includes(coord)) {
                                      $('div').remove('#defPack_villageOverLay_' + villageData.id);
                                      commandsToRename.forEach(command => {
                                          if (command.coords === coord) {
                                              commandsToRename.delete(command);
                                          }
                                      });
                                  } else {
                                      const mapVillageImage = $(`[id="map_village_${villageData.id}"]`);
                                      const mapVillageOverlay = {
                                          id: 'defPack_villageOverLay_' + villageData.id,
                                          css: {
                                              'zIndex': '50',
                                              'position': 'absolute',
                                              'opacity': '0.3',
                                              'width': (TWMap.map.scale[0] - 1).toString() + 'px',
                                              'height': (TWMap.map.scale[1] - 1).toString() + 'px',
                                              'background': 'blue',
                                              'left': mapVillageImage.css('left'),
                                              'top': mapVillageImage.css('top')
                                          }
                                      };
                                      mapVillageImage.after($("<div>", mapVillageOverlay));

                                      commands.forEach(command => commandsToRename.add(command));
                                  }
                              }
                              refreshCoordList(commandsToRename);
                          });
                      }
                      return false;
                  } else {
                      DS_Map.map._DShandleClick(e);
                      return false;
                  }
              };

              const cacheExtendedPopupData = async (id, cachedObject) => {
                  await twLib.get({url: `${game_data.link_base_pure.replace(/village=\d+/, `village=${id}`)}overview`}).then(async (html) => {
                      const incomings = $(html).find('#commands_incomings tbody tr.command-row.no_ignored_command');
                      const wall = cachedObject.buildings.wall || 0;
                      const stackCheckerSettings = {
                          initialWall: wall,
                          wallParam: `&def_wall=${wall}`
                      };

                      const simulationUrl = await buildSimulationUrl(html, stackCheckerSettings.wallParam, id);
                      await twLib.get({url: `${simulationUrl}`, dataType: 'html'}).then((response) => {
                          stackCheckerSettings.clearsNeeded = $(response).find('#content_value').find('p').css('font-style', 'italic').find('b').text();
                          stackCheckerSettings.postClear = parseInt($(response).find('th:contains("Schaden durch Rammböcke:")').next().find('b:last-child').text())
                          stackCheckerSettings.totalPopFromSimulation = $(response).find('td:contains("Verteidiger")').closest('tr').find('td:last').first().text();

                          const data = configureHealthCheckValues(stackCheckerSettings, incomings);
                          TWMap.popup.extendedMapPopupCache[id] = [
                              {
                                  header: 'DEF-Stärke',
                                  value: `<strong style="color: ${data.color}">${data.message}</strong>`
                              },
                              {
                                  header: 'DEF',
                                  value: `<strong>${(stackCheckerSettings.clearsNeeded.indexOf('meer dan 100') !== -1 ? stackCheckerSettings.clearsNeeded : (data.clears))}</strong> Angriff(e)`
                              },
                              {
                                  header: 'Eintreffend',
                                  value: data.totalAttacks
                              },
                              {
                                  header: 'DEF hält noch',
                                  value: `<strong style="color: ${data.surplus > 0 ? 'black' : 'red'}">${data.surplus}</strong> weitere Angriffe`
                              },
                              {
                                  header: 'Wall Info',
                                  value: `<strong>#1</strong> <img style="vertical-align: bottom;" src="graphic/unit/unit_ram.png" title="" alt=""> Angriff
                                  <img src="graphic/buildings/wall.png" title="" alt=""> <strong>${stackCheckerSettings.initialWall}</strong> -> <strong style="color: ${data.color}"> ${(isNaN(stackCheckerSettings.postClear) ? stackCheckerSettings.initialWall : stackCheckerSettings.postClear)}</strong>`
                              },
                              {
                                  header: 'Ges. BhP',
                                  value: `<strong style="background-color: ${data.stackColor}"><span class="icon header population"></span> ${stackCheckerSettings.totalPopFromSimulation}</a></strong>`
                              }
                          ];
                      });
                  })
              }
              const renderAdditionalInfo = async (village) => {
                  const mapStackHealth = () => (v) => `<tr class="defPack_mapExtendedInfo"><td>${v.header}</td><td>${v.value}</td></tr>`;

                  if (village && Number(village.owner) === Number(game_data.player.id)) {
                      const id = village.id;
                      const cachedObject = TWMap.popup._cache[id];
                      if (!TWMap.popup.extendedMapPopupCache[id] && cachedObject !== 'notanobject') {
                          await cacheExtendedPopupData(id, cachedObject);
                      }

                      $('.defPack_mapExtendedInfo').remove();
                      if (TWMap.popup.extendedMapPopupCache[id]) {
                          $('#map_popup #info_points_row').closest('tr').after(`${Object.values(TWMap.popup.extendedMapPopupCache[id]).map(mapStackHealth()).join('')}`);
                      }
                  }
              };
              const createDisplayForVillageHandler = () => async (e, a, t) => {
                  TWMap.popup._displayForVillage(e, a, t);

                  await renderAdditionalInfo(e);
              };

              if (userData.addStackHealthMap) {
                  TWMap.popup.extendedMapPopupCache = {};
                  TWMap.popup._displayForVillage = TWMap.popup.displayForVillage;
                  TWMap.popup.displayForVillage = createDisplayForVillageHandler();
              }
              break;
      }

      function getTaggerSettings(sanguActive) {
          if (!sanguActive) {
              sanguActive = localStorage.getItem('sangu_sanguActive') === 'true' && $('#sangu_activator').length > 0
          }
          const sanguSavedSettings = localStorage.getItem('sangu_sangusettings');
          const sanguSettings = sanguSavedSettings ? JSON.parse(sanguSavedSettings) : {};
          const useSanguSettings = sanguActive && userData.useSanguTaggerSettings && sanguSettings.mainTagger2;
          const taggerData = {
              OK: {
                  message: settings.standard.taggerData.OK.message,
                  tag: useSanguSettings ? sanguSettings.mainTagger2.defaultDescription : userData.tagger_data.OK.tag,
                  shortKey: userData.tagger_data.OK.shortKey,
                  color: userData.tagger_data.OK.color
              },
              DODGED: {
                  message: settings.standard.taggerData.DODGED.message,
                  tag: userData.tagger_data.DODGED.tag,
                  shortKey: userData.tagger_data.DODGED.shortKey,
                  color: userData.tagger_data.DODGED.color
              },
              DODGE: {
                  message: settings.standard.taggerData.DODGE.message,
                  tag: useSanguSettings ? sanguSettings.mainTagger2.otherDescs[0].renameTo : userData.tagger_data.DODGE.tag,
                  shortKey: userData.tagger_data.DODGE.shortKey,
                  color: userData.tagger_data.DODGE.color
              },
              SNIPED: {
                  message: settings.standard.taggerData.SNIPED.message,
                  tag: userData.tagger_data.SNIPED.tag,
                  shortKey: userData.tagger_data.SNIPED.shortKey,
                  color: userData.tagger_data.SNIPED.color
              },
              SNIPE_THIS: {
                  message: settings.standard.taggerData.SNIPE_THIS.message,
                  tag: userData.tagger_data.SNIPE_THIS.tag,
                  shortKey: userData.tagger_data.SNIPE_THIS.shortKey,
                  color: userData.tagger_data.SNIPE_THIS.color
              },
              CHECK_STACK: {
                  message: settings.standard.taggerData.CHECK_STACK.message,
                  tag: useSanguSettings ? sanguSettings.mainTagger2.otherDescs[2].renameTo : userData.tagger_data.CHECK_STACK.tag,
                  shortKey: userData.tagger_data.CHECK_STACK.shortKey,
                  color: userData.tagger_data.CHECK_STACK.color
              }
          };
          return {...taggerData, ...userData.custom_tagger_data};
      }

      function renameCommandsWithProgressBar(commands, progressBarElement, taggerTextElement, incomingRows) {
          let progressBar = $(`#defPack_${progressBarElement}`), size = commands.length, index = 1;
          UI.InitProgressBars();
          UI.updateProgressBar(progressBar, 0, size);
          $(progressBar).show();

          commands.forEach((command) => {
              const textFromTagger = $(`#defPack_${taggerTextElement}`).val();
              const newCommand = assembleNewCommand(command, textFromTagger);
              renameCommand(command.id, newCommand, true).done(function () {
                  UI.updateProgressBar(progressBar, index, size);
                  $(progressBar).find('span:last').css('color', index / size > 0.6 ? 'white' : 'black');
                  index++;
                  if (incomingRows) $(incomingRows).find(`span.quickedit[data-id="${command.id}"]`).find('span.quickedit-label').text(newCommand);
              })
          });
      }

      function loadUserData() {
          if (userData.length === undefined) {
              const savedData = localStorage.getItem(settings.storageKeys.defPackSettings);
              if (savedData !== null) {
                  userData = $.extend(true, userData, JSON.parse(savedData));
                  // Force add new settings if the user had an older version with other settings
                  if (userData.duplicatesCheckerEnabled === undefined) userData.duplicatesCheckerEnabled = true;
                  if (userData.incomingsOverviewEnhancementEnabled === undefined) userData.incomingsOverviewEnhancementEnabled = true;
                  if (userData.requestOSEnhancementEnabled === undefined) userData.requestOSEnhancementEnabled = true;
                  if (userData.clear_data === undefined) userData.clear_data = settings.standard.clear;
                  if (userData.stack_data === undefined) userData.stack_data = settings.standard.preStackData;
                  if (userData.incoming_stack_data === undefined) userData.incoming_stack_data = settings.standard.incomingStackData;
                  if (userData.stack_data["NOK"].bgColor === undefined) {
                      userData.stack_data = settings.standard.preStackData;
                  }
                  if (userData.tagger_data === undefined) userData.tagger_data = settings.standard.taggerData;
                  if (userData.tagger_data["DODGED"] === undefined) {
                      userData.tagger_data["DODGED"] = settings.standard.taggerData.DODGED;
                  }
                  if (userData.useSanguTaggerSettings === undefined) userData.useSanguTaggerSettings = true;
                  if (userData.showNextIncBrowserTab === undefined) userData.showNextIncBrowserTab = true;
                  if (userData.addStackHealthMap === undefined) userData.addStackHealthMap = true;
                  if (userData.offBoosts === undefined) userData.offBoosts = settings.standard.offBoosts;
                  if (userData.offTechLevels === undefined) userData.offTechLevels = settings.standard.offTechLevels;
                  if (userData.offFlag === undefined) userData.offFlag = 0;
                  if (userData.custom_tagger_data === undefined) userData.custom_tagger_data = {};
                  if (userData.addAdvancedTaggingInterfaceOnOverviewScreen === undefined) userData.addAdvancedTaggingInterfaceOnOverviewScreen = true;
                  if (userData.addAdvancedTaggingInterfaceOnInfoVillageScreen === undefined) userData.addAdvancedTaggingInterfaceOnInfoVillageScreen = true;
                  if (userData.restyleWidgetsOnOverviewScreen === undefined) userData.restyleWidgetsOnOverviewScreen = true;
                  localStorage.setItem(settings.storageKeys.defPackSettings, JSON.stringify(userData));
              } else {
                  setToDefaultSettings();
              }
          }
          config = JSON.parse(localStorage.getItem(settings.storageKeys.config)) || {};
          techLevels = JSON.parse(localStorage.getItem(settings.storageKeys.techLevels)) || {};
          if (!config || !config?.lastCheckedAt || Math.abs(new Date().getTime() - new Date(config.lastCheckedAt).getTime()) / 36e5 > settings.refreshPeriod) {
              cacheEveryConfig();
          }
      }

      function setToDefaultSettings() {
          userData.clear_data = settings.standard.clear;
          userData.stack_data = settings.standard.preStackData;
          userData.incoming_stack_data = settings.standard.incomingStackData;
          userData.tagger_data = settings.standard.taggerData;
          userData.nightEnabled = false;
          userData.duplicatesCheckerEnabled = true;
          userData.incomingsOverviewEnhancementEnabled = true;
          userData.requestOSEnhancementEnabled = true;
          userData.useSanguTaggerSettings = true;
          userData.showNextIncBrowserTab = true;
          userData.addStackHealthMap = true;
          userData.offBoosts = settings.standard.offBoosts;
          userData.offTechLevels = settings.standard.offTechLevels;
          userData.offFlag = 0;
          userData.custom_tagger_data = {};
          userData.addAdvancedTaggingInterfaceOnOverviewScreen = true;
          userData.addAdvancedTaggingInterfaceOnInfoVillageScreen = true;
          userData.restyleWidgetsOnOverviewScreen = true;
          localStorage.setItem(settings.storageKeys.defPackSettings, JSON.stringify(userData));
      }

      function cacheEveryConfig() {
          config.lastCheckedAt = new Date();
          let availableUnits = {};
          $.when(twLib.get('/interface.php?func=get_unit_info')).done(function (xml) {
              $(xml).find('config').children().each((index, unit) => availableUnits[$(unit).prop('nodeName')] = $(unit).find('speed').text());
              config.unitSpeedSettings = availableUnits;
              localStorage.setItem(settings.storageKeys.config, JSON.stringify(config));
          });
          $.when(twLib.get('/interface.php?func=get_config')).done((xml) => {
              config.worldSettings = {};
              ['fake_limit', 'farm_limit', 'tech'].forEach((setting) => config.worldSettings[setting] = parseInt($(xml).find(setting).text()));
              if (config.worldSettings.tech === settings.tech.LEVELS) {
                  $.when(twLib.get({url: settings.tech.url})).done(function (html) {
                      cachePlayerTechLevels(html);
                  });
              }
              localStorage.setItem(settings.storageKeys.config, JSON.stringify(config));
          });
      }

      // TODO rework using data attribute, ooit
      function addInputChangeListenersOnSettingsPage() {
          $("#defPackNightMode").off().on().change(function () {
              userData.nightEnabled = $(this).is(":checked");
              localStorage.setItem(settings.storageKeys.defPackSettings, JSON.stringify(userData));
          });
          $("#defPackDuplicatesChecker").off().on().change(function () {
              userData.duplicatesCheckerEnabled = $(this).is(":checked");
              localStorage.setItem(settings.storageKeys.defPackSettings, JSON.stringify(userData));
          });
          $("#defPackIncomingsOverviewEnhancements").off().on().change(function () {
              userData.incomingsOverviewEnhancementEnabled = $(this).is(":checked");
              localStorage.setItem(settings.storageKeys.defPackSettings, JSON.stringify(userData));
          });
          $("#defPackRequestOSEnhancements").off().on().change(function () {
              userData.requestOSEnhancementEnabled = $(this).is(":checked");
              localStorage.setItem(settings.storageKeys.defPackSettings, JSON.stringify(userData));
          });
          $("#defPackUseSanguTaggerSettings").off().on().change(function () {
              userData.useSanguTaggerSettings = $(this).is(":checked");
              localStorage.setItem(settings.storageKeys.defPackSettings, JSON.stringify(userData));
          });
          $("#defPackShowNextIncBrowserTab").off().on().change(function () {
              userData.showNextIncBrowserTab = $(this).is(":checked");
              localStorage.setItem(settings.storageKeys.defPackSettings, JSON.stringify(userData));
          });
          $("#defPackAddStackHealthMap").off().on().change(function () {
              userData.addStackHealthMap = $(this).is(":checked");
              localStorage.setItem(settings.storageKeys.defPackSettings, JSON.stringify(userData));
          });
          $("#defPackAddAdvancedTaggingInterfaceOnOverviewScreen").off().on().change(function () {
              userData.addAdvancedTaggingInterfaceOnOverviewScreen = $(this).is(":checked");
              localStorage.setItem(settings.storageKeys.defPackSettings, JSON.stringify(userData));
          });
          $("#defPackAddAdvancedTaggingInterfaceOnInfoVillageScreen").off().on().change(function () {
              userData.addAdvancedTaggingInterfaceOnInfoVillageScreen = $(this).is(":checked");
              localStorage.setItem(settings.storageKeys.defPackSettings, JSON.stringify(userData));
          });
          $("#defPackRestyleWidgetsOnOverviewScreen").off().on().change(function () {
              userData.restyleWidgetsOnOverviewScreen = $(this).is(":checked");
              localStorage.setItem(settings.storageKeys.defPackSettings, JSON.stringify(userData));
          });
          $("#defPackDisableDoubleCheckingIfSanguIsNotActive").off().on().change(function () {
              userData.disableDoubleCheckingIfSanguIsNotActive = $(this).is(":checked");
              localStorage.setItem(settings.storageKeys.defPackSettings, JSON.stringify(userData));
          });
          $("#defPackIgnoreScoutsInStackHealthCheck").off().on().change(function () {
              userData.ignoreScoutsInStackHealthCheck = $(this).is(":checked");
              localStorage.setItem(settings.storageKeys.defPackSettings, JSON.stringify(userData));
          });
          $("#defPackIgnoreOwnTroopsInStackHealthCheck").off().on().change(function () {
              userData.ignoreOwnTroopsInStackHealthCheck = $(this).is(":checked");
              localStorage.setItem(settings.storageKeys.defPackSettings, JSON.stringify(userData));
          });
          for (let unit in settings.standard.clear) {
              $(`#defPack_${unit}`).off().on().change(function () {
                  userData.clear_data[unit] = this.value;
                  localStorage.setItem(settings.storageKeys.defPackSettings, JSON.stringify(userData));
                  $('.defPack_settingsClearPop').text(`${Object.keys(settings.standard.clear).reduce((a, b) => a + (userData.clear_data[b] * settings.troopPop[b]), 0)}`);
              });
          }
          for (let data in settings.standard.preStackData) {
              $(`.defPackStackData_${data}`).off().on().change(function () {
                  userData.stack_data[data][$(this).data('value')] = this.value;
                  localStorage.setItem(settings.storageKeys.defPackSettings, JSON.stringify(userData));
              });
          }
          for (let data in settings.standard.incomingStackData) {
              $(`.defPackIncomingStackData_${data}`).off().on().change(function () {
                  userData.incoming_stack_data[data][$(this).data('value')] = this.value;
                  localStorage.setItem(settings.storageKeys.defPackSettings, JSON.stringify(userData));
              });
          }
          for (let data in settings.standard.taggerData) {
              $(`.defPackTaggerData_${data}`).off().on().change(function () {
                  userData.tagger_data[data][$(this).data('type')] = this.value;
                  localStorage.setItem(settings.storageKeys.defPackSettings, JSON.stringify(userData));
              });
          }
          for (let data in settings.standard.offBoosts) {
              $(`#defPack_OffBoost_${data}`).off().on().change(function () {
                  userData.offBoosts[data] = this.value;
                  localStorage.setItem(settings.storageKeys.defPackSettings, JSON.stringify(userData));
              });
          }
          for (let data in settings.standard.offTechLevels) {
              $(`#defPack_OffTechLevel_${data}`).off().on().change(function () {
                  userData.offTechLevels[data] = this.value;
                  localStorage.setItem(settings.storageKeys.defPackSettings, JSON.stringify(userData));
              });
          }
          $('#defPack_offFlagBoostSelect').off().on().change(function () {
              $('#defPack_offFlag').attr('src', settings.images.flag(this.value));
              userData.offFlag = this.value;
              localStorage.setItem(settings.storageKeys.defPackSettings, JSON.stringify(userData));
          });
          $('#defPackSaveTaggerCustomMessage').off().on().click(() => {
              const tag = `custom_${Object.keys(userData.custom_tagger_data).length}`;
              const customTaggerColorElement = $('#defPackCustomTaggerColor');
              userData.custom_tagger_data[tag] = {
                  message: $('#defPackCustomTaggerMessage').val(),
                  tag: $('#defPackCustomTaggerTag').val(),
                  shortKey: $('#defPackCustomTaggerShortKey').val(),
                  color: customTaggerColorElement.val()
              }
              localStorage.setItem(settings.storageKeys.defPackSettings, JSON.stringify(userData));
              $(`#defPackCustomTaggerMessage, #defPackCustomTaggerTag, #defPackCustomTaggerShortKey`).val('');
              customTaggerColorElement.val('#efefef');
              $('[data-setting="tagger"] tbody:first').append(`
                  <tr>
                      <td width="20%">
                          ${userData.custom_tagger_data[tag].message} <img style="cursor: pointer; height: 12px; vertical-align: middle" src="graphic/delete.png" id="defPackRemoveCustomTaggerData_${tag}" alt="">
                      </td>
                      <td width="50%">
                          <input style="width: 98%;" type="input" class="defPackCustomTaggerData_${tag}" data-type="tag" value="${userData.custom_tagger_data[tag].tag}">
                      </td>
                      <td width="15%">
                          <input style="width: 90%;" type="input" class="defPackCustomTaggerData_${tag}" maxlength="1" data-type="shortKey" value="${userData.custom_tagger_data[tag].shortKey}">
                      </td>
                      <td width="10%">
                          <input style="width: 90%;" type="color" class="defPackCustomTaggerData_${tag}" data-type="color" value="${userData.custom_tagger_data[tag].color ?? '#efefef'}">
                      </td>
                  </tr>
              `);
              addInputChangeListenersOnSettingsPage();
          })
          for (let data in userData.custom_tagger_data) {
              $(`#defPackRemoveCustomTaggerData_${data}`).off().on().click(function () {
                  $(this).closest('tr').remove();
                  delete userData.custom_tagger_data[data];
                  localStorage.setItem(settings.storageKeys.defPackSettings, JSON.stringify(userData));
              })
              $(`.defPackCustomTaggerData_${data}`).off().on().change(function () {
                  userData.custom_tagger_data[data][$(this).data('type')] = this.value;
                  localStorage.setItem(settings.storageKeys.defPackSettings, JSON.stringify(userData));
              });
          }
      }

      function addEnhancedIncomingsTable() {
          let incomings = {};
          const incomingRows = $('#incomings_table .row_a, #incomings_table .row_b');
          const source = $('#incomings_table th:containsAnyWord(Herkomst,Source)').index();
          const taggerSettings = getTaggerSettings();
          addHotKeyRenameCommandOnHover(taggerSettings, incomingRows);

          if (userData.showNextIncBrowserTab) {
              $(window.TribalWars).off().on("global_tick", function () {
                  const arrivalTimerIndex = $('#incomings_table th:containsAnyWord(Komt aan, Arrives)').index();
                  document.title = 'Next inc: ' + $('#incomings_table .row_a:visible, #incomings_table .row_b:visible').first().find(`td:eq(${arrivalTimerIndex})`).text();
              });
          }

          // Total Snobs
          incomings.snobs = $(incomingRows).find('img[src*="snob.png"]');
          // Possible Snob Spam Targets
          incomings.possibleSnobSpam = incomings.snobs
              .filter((_, row) => $(`#incomings_table a[href*="screen=info_village"]:contains("${$(row).closest('tr').find(`td:eq(${source}) a`).text().toCoord()}")`).length > 4).get();

          // Snobs
          addSnobIncomingsTableDetail(incomings, 'green', $(incomingRows).find('img[src*="graphic/command/attack_small.png"]'));
          addSnobIncomingsTableDetail(incomings, 'orange', $(incomingRows).find('img[src*="graphic/command/attack_medium.png"]'));
          addSnobIncomingsTableDetail(incomings, 'red', $(incomingRows).find('img[src*="graphic/command/attack_large.png"]'));
          addSnobIncomingsTableDetail(incomings, 'unknownS', $(incomingRows).find('img[src*="attack.png"]'));

          incomings.unknown = incomingRows.find('img[src*="graphic/command/attack.png"]');
          //incomings.ok = incomingRows.find('td .quickedit-label:containsAnyWord(OK, SNIPED)').closest('tr');
          incomings.ok = incomingRows.find('td .quickedit-label:containsAnyWord(OK, SNIPED), td .quickedit-label:contains("[+++]"), td .quickedit-label:contains("[---]")').closest('tr');

          //incomings.nok = incomingRows.find('td .quickedit-label:not(:containsAnyWord(OK, SNIPED))').closest('tr');
          incomings.nok = incomingRows.find('td .quickedit-label:not(:contains("OK"), :contains("SNIPED")):not(:contains("[+++]"), :contains("[---]"))').closest('tr');

          incomings.noTag = incomingRows.find('td .quickedit-label:contains("Angriff")');

          const total = [...getUniquePlayers()].reduce((total, player) => player === 'Bolwerk'
              ? total + $('#incomings_table a[href*="id=0"]').closest('td').prev('td:visible').length
              : total + $(`#incomings_table a[href*="screen=info_player"]:contains("${player}")`).length, 0);

          const incomingsHtml = `<table width="100%" cellspacing="0" cellpadding="0">
              <tbody>
                  <tr>
                      <td width="50%" valign="top">
                          <div class="widget vis spaced">
                              <h4 class="ui-sortable-handle">Detaillierte Angriffsübersicht</h4>
                                  <table id="defPackIncsDetailOverview" width="100%" class="vis">
                                      <tbody>
                                          <tr>
                                              <td width="25%"><strong><img src="graphic/unit/att.png" title="Binnenkomende aanvallen" style="vertical-align: -2px" alt="" class=""> Ingesamt</strong></td>
                                              <td colspan="4"><strong><a style="cursor: pointer;" id="defPackFilterReset">${total}</a></strong><br></td>
                                          </tr>
                                          <tr>
                                              <th><img src="graphic/command/attack_small.png" title="" alt="" class=""></th>
                                              <th><img src="graphic/command/attack_medium.png" title="" alt="" class=""></th>
                                              <th><img src="graphic/command/attack_large.png" title="" alt="" class=""></th>
                                              <th><span class="commandicon-wt"><img src="graphic/command/attack.png"></span></th>
                                          </tr>
                                          <tr>
                                              <td><strong style="color: darkgreen"><a style="cursor: pointer;" id="defPackFilter_green">${incomings.green.length}</a></strong><span> (${(incomings.green.length / total * 100).round(2)}%)</span><br></td>
                                              <td><strong style="color: darkorange"><a style="cursor: pointer;" id="defPackFilter_orange">${incomings.orange.length}</a></strong><span> (${(incomings.orange.length / total * 100).round(2)}%)</span><br></td>
                                              <td><strong style="color: darkred"><a style="cursor: pointer;" id="defPackFilter_red">${incomings.red.length}</a></strong><span> (${(incomings.red.length / total * 100).round(2)}%)</span><br></td>
                                              <td><strong><a style="cursor: pointer;" id="defPackFilter_unknown">${incomings.unknown.length}</a></strong><span> (${(incomings.unknown.length / total * 100).round(2)}%)</span><br></td>
                                          </tr>
                                          <tr>
                                              <th colspan="5">Tag Information</th>
                                          </tr>
                                          <tr>
                                              <td><img width="16px" src="${settings.images.OK}" alt=""> Bearbeitet</td>
                                              <td colspan="4"><strong><a style="cursor: pointer;" id="defPackFilter_ok">${incomings.ok.length || 0}</a></strong><span> (${((incomings.ok.length || 0) / total * 100).round(2)}%)</span> <small><a style="cursor: pointer;" id="defPackVillageCoordsOK">Copy Coords</a></small></td>
                                          </tr>
                                          <tr>
                                              <td><img width="16px" src="${settings.images.NOK}" alt=""> TO DO</td>
                                              <td colspan="4"><strong><a style="cursor: pointer;" id="defPackFilter_nok">${incomings.nok.length || 0}</a></strong><span> (${((incomings.nok.length || 0) / total * 100).round(2)}%)</span> <small><a style="cursor: pointer;" id="defPackVillageCoordsNOK">Copy Coords</a></small></td>
                                          </tr>
                                          <tr>
                                              <td><img width="16px" src="${settings.images.NO_TAG}" alt=""> Nicht umbenannt</td>
                                              <td colspan="4"><strong><a style="cursor: pointer;" id="defPackFilter_noTag">${incomings.noTag.length || 0}</a></strong><span> (${((incomings.noTag.length || 0) / total * 100).round(2)}%)</span></td>
                                          </tr>
                                          <tr>
                                              <th colspan="5">Filtern</th>
                                          </tr>
                                          <tr>
                                              <td colspan="5">
                                                  <input type="button" class="defPack_groupBy" data-group-by="target" value="Filter nach Ziel">
                                                  <input type="button" style="margin-left: 5px" class="defPack_groupBy" data-group-by="source" value="Filter nach Herkunft">
                                                  <input type="button" style="margin-left: 5px" id="defPack_resetGroup" value="Zurücksetzen">
                                              </td>
                                          </tr>
                                          <tr data-group="defPack_customerTagger">
                                              <th colspan="5">Taggen</th>
                                          </tr>
                                          <tr data-group="defPack_customerTagger">
                                              <td colspan="5" id="defPack_overviewTaggerSettings">
                                                  <div>
                                                      ${getTaggerButtons(taggerSettings).join('')}
                                                  </div>
                                                  <div class="float_left" style="width: 100%">
                                                      <input type="text" style="width: 50%" id="defPack_overviewTaggerText" name="Tag" value="OK">
                                                      <a id="defPack_overviewTaggerBtn" style="margin-top: 5px" class="btn">Tag!</a>
                                                      <div id="defPack_overviewTaggingProgressBar" class="progress-bar live-progress-bar progress-bar-alive" style="display: none">
                                                          <div></div>
                                                          <span class="label"></span>
                                                      </div>
                                                  </div>
                                              </td>
                                          </tr>
                                          <tr data-group="defPack_incsWallUnder20">
                                              <th colspan="5" id="defPack_incsWallUnder20Header" style="cursor: pointer">"Klick" Check für Wall <20</th>
                                          </tr>
                                          <tr data-group="defPack_incsWallUnder20" id="defPack_incs_wallUnder20Content">
                                          </tr>
                                      </tbody>
                                  </table>
                          </div>
                      </td>
                      <td width="50%" valign="top">
                          <div class="am_widget vis spaced">
                              <h4 class="ui-sortable-handle">AG Übersicht</h4>
                              <table width="100%" class="vis">
                                  <tbody>
                                      <tr>
                                          <td><img src="graphic/command/snob.png" alt=""> <strong>Ingesamt</strong></td>
                                          <td colspan="4"><strong><a style="cursor: pointer" id="defPackFilter_snobs">${incomings.snobs.length}</a></strong><br></td>
                                      </tr>
                                      <tr>
                                          <th style="width: 20%"></th>
                                          <th style="width: 20%"><img src="graphic/command/attack_small.png" title="" alt="" class=""> <img src="graphic/command/snob.png" alt=""></th>
                                          <th style="width: 20%"><img src="graphic/command/attack_medium.png" title="" alt="" class=""> <img src="graphic/command/snob.png" alt=""></th>
                                          <th style="width: 20%"><img src="graphic/command/attack_large.png" title="" alt="" class=""> <img src="graphic/command/snob.png" alt=""></th>
                                          <th style="width: 20%"><span class="commandicon-wt"><img src="graphic/command/attack.png"></span> <img src="graphic/command/snob.png" alt="">
                                      </th>
                                      <tr class="row_a">
                                          <td><img width="16px" style="cursor:pointer;" src="${settings.images.snobs.OK}" alt="" title="Nobles tagged with OK/SNIPED"> (${((incomings.greenSnobsOK.length + incomings.orangeSnobsOK.length + incomings.redSnobsOK.length + incomings.unknownSSnobsOK.length) / incomings.snobs.length * 100 || 0).round(2)}%)</td>
                                          <td><strong><a style="cursor: pointer" id="defPackFilter_greenSnobsOK">${incomings.greenSnobsOK.length}</a></strong><span> (${(incomings.greenSnobsOK.length / incomings.snobs.length * 100 || 0).round(2)}%)</span><br></td>
                                          <td><strong><a style="cursor: pointer" id="defPackFilter_orangeSnobsOK">${incomings.orangeSnobsOK.length}</a></strong><span> (${(incomings.orangeSnobsOK.length / incomings.snobs.length * 100 || 0).round(2)}%)</span><br></td>
                                          <td><strong><a style="cursor: pointer" id="defPackFilter_redSnobsOK">${incomings.redSnobsOK.length}</a></strong><span> (${(incomings.redSnobsOK.length / incomings.snobs.length * 100 || 0).round(2)}%)</span><br></td>
                                          <td><strong><a style="cursor: pointer" id="defPackFilter_unknownSSnobsOK">${incomings.unknownSSnobsOK.length}</a></strong><span> (${(incomings.unknownSSnobsOK.length / incomings.snobs.length * 100 || 0).round(2)}%)</span><br></td>
                                      </tr>
                                      <tr class="row_b">
                                          <td><img width="16px" style="cursor:pointer;" src="${settings.images.snobs.CHECK}" alt="" title="Nobles tagged with CHECK"> (${((incomings.greenSnobsCheck.length + incomings.orangeSnobsChecklength + incomings.redSnobsCheck.length + incomings.unknownSSnobsCheck.length) / incomings.snobs.length * 100 || 0).round(2)}%)</td>
                                          <td><strong><a style="cursor: pointer" id="defPackFilter_greenSnobsCheck">${incomings.greenSnobsCheck.length}</a></a></strong><span> (${(incomings.greenSnobsCheck.length / incomings.snobs.length * 100 || 0).round(2)}%)</span><br></td>
                                          <td><strong><a style="cursor: pointer" id="defPackFilter_orangeSnobsCheck">${incomings.orangeSnobsCheck.length}</a></strong><span> (${(incomings.orangeSnobsCheck.length / incomings.snobs.length * 100 || 0).round(2)}%)</span><br></td>
                                          <td><strong><a style="cursor: pointer" id="defPackFilter_redSnobsCheck">${incomings.redSnobsCheck.length}</a></strong><span> (${(incomings.redSnobsCheck.length / incomings.snobs.length * 100 || 0).round(2)}%)</span><br></td>
                                          <td><strong><a style="cursor: pointer" id="defPackFilter_unknownSSnobsCheck">${incomings.unknownSSnobsCheck.length}</a></strong><span> (${(incomings.unknownSSnobsCheck.length / incomings.snobs.length * 100 || 0).round(2)}%)</span><br></td>
                                      </tr>
                                      <tr class="row_a">
                                          <td><img width="16px" style="cursor:pointer;" src="${settings.images.snobs.NOK}" alt="" title="Nobles NOT tagged with OK/SNIPED"> (${((incomings.greenSnobsNOK.length + incomings.orangeSnobsNOK.length + incomings.redSnobsNOK.length + incomings.unknownSSnobsNOK.length) / incomings.snobs.length * 100 || 0).round(2)}%)</td>
                                          <td><strong><a style="cursor: pointer" id="defPackFilter_greenSnobsNOK">${incomings.greenSnobsNOK.length}</a></a></strong><span> (${(incomings.greenSnobsNOK.length / incomings.snobs.length * 100 || 0).round(2)}%)</span><br></td>
                                          <td><strong><a style="cursor: pointer" id="defPackFilter_orangeSnobsNOK">${incomings.orangeSnobsNOK.length}</a></strong><span> (${(incomings.orangeSnobsNOK.length / incomings.snobs.length * 100 || 0).round(2)}%)</span><br></td>
                                          <td><strong><a style="cursor: pointer" id="defPackFilter_redSnobsNOK">${incomings.redSnobsNOK.length}</a></strong><span> (${(incomings.redSnobsNOK.length / incomings.snobs.length * 100 || 0).round(2)}%)</span><br></td>
                                          <td><strong><a style="cursor: pointer" id="defPackFilter_unknownSSnobsNOK">${incomings.unknownSSnobsNOK.length}</a></strong><span> (${(incomings.unknownSSnobsNOK.length / incomings.snobs.length * 100 || 0).round(2)}%)</span><br></td>
                                      </tr>
                                      <tr class="row_b">
                                          <th colspan="5"><strong>Mögliche AG Spam Bude (5+ AG-Angriffe aus dem selben Dorf)</strong></th>
                                      </tr>
                                      <tr>
                                          <td><img src="graphic/command/snob.png" alt=""> <strong>Ingesamt</strong></td>
                                          <td colspan="4"><strong><a style="cursor: pointer" id="defPackFilter_possibleSnobSpam">${incomings.possibleSnobSpam.length}</a></strong><br></td>
                                      </th>
                                  </tbody>
                              </table>
                          </div>
                          <div class="am_widget vis spaced">
                              <h4 class="ui-sortable-handle">Angriffe pro Spieler</h4>
                              <div class="body">
                                  <table style="width:100%">
                                      <tbody id="defPack_incsPerPlayer">
                                      <tr>
                                          <th colspan="5">Angriffe pro Tag</th>
                                      </tr>
                                      </tbody>
                                  </table>
                              </div>
                          </div>
                      </td>
              </tr>
              </tbody></table>`;

          $('.overview_filters').before(incomingsHtml);

          refreshIncsPerPlayer();

          const showCoordsPopup = () => {
              Dialog.show('Coords',
                  `<div width="350px">
                      <div class="info_box">Koodinaten kopieren</div>
                      <img width="16px" src="${settings.images.OK}" alt=""> 'OK' Tags
                      <textarea rows="5" style="width: 96%">${Array.from([...new Set(incomings.ok.find('td:eq(1)').map((_, el) => $(el).text().toCoord()).get())] || []).join(' ')}</textarea>
                      <img width="16px" src="${settings.images.NOK}" alt=""> TO DO
                      <textarea rows="5" style="width: 96%">${Array.from([...new Set(incomings.nok.find('td:eq(1)').map((_, el) => $(el).text().toCoord()).get())] || []).join(' ')}</textarea>
                  </div>`
              )
          }
          $('#defPackVillageCoordsOK, #defPackVillageCoordsNOK').click(() => showCoordsPopup());

          for (const incomingType in incomings) {
              $(`#defPackFilter_${incomingType}`).click(function () {
                  $('#defPack_resetGroup').click();
                  $('#incomings_table tr').not(':last').not(':first').hide();
                  incomings[$(this).attr('id').match('\_(.*)')[1]].closest('tr').show();

                  refreshIncsPerPlayer();
              })
          }

          $('#defPackFilterReset').click(function () {
              $('#defPack_resetGroup').click();
              $('#incomings_table tr').not(':last').not(':first').show();
              $('#playerNames a.group-menu-item[data-id="all"]').click();

              refreshIncsPerPlayer();
          });

          if (Number(game_data.player.incomings) > 1000) {
              const mapHref = () => (_, page) => $(page).attr('href');
              const isAllPagesSelected = $('#paged_view_content table').find('strong:contains("alle")');
              const pages = isAllPagesSelected.length > 0 ? isAllPagesSelected.closest('td').find('.paged-nav-item').map(mapHref()).get()
                  : [window.location.href, ...$('.paged-nav-item:not(:last)').map(mapHref())];

              pages.forEach((page, index) => {
                  twLib.get({
                      url: page,
                      dataType: 'html',
                      async: true,
                      success: function (html) {
                          loadNextPageIncomings(index === 0, html);
                      }
                  })
              })
          }

          incomingRows
              .find('.quickedit')
              .each((_, el) => {
                  const commandText = $(el).find('.quickedit-label').text().trim();
                  const taggingSetting = Object.values(taggerSettings).find((setting) => commandText.includes(setting.tag));
                  $(el).before(`<span class="defPackCommandTagged" style="display: inline-block; border: 1px solid black; width: 10px; height: 10px; background-color: ${taggingSetting?.color ?? '#efefef'}; border-radius: 50%"></span>`)
              });

          if (userData.duplicatesCheckerEnabled) {
              $('#incomings_table').before(`<table><tbody>${$('#incomings_table tr:last').clone(true).html()}</tbody></table>`);
              $("#select_all, #selectAll").prop('onclick', null);
              $('#select_all:first, #selectAll:first').attr('id', 'select_all_duplicate');
              $('#select_all, #selectAll, #select_all_duplicate').off().on('change', function () {
                  $('#incomings_table tr:visible').not(':last').not(':first').find(':checkbox').prop('checked', this.checked);
                  $('#incomings_table tr:hidden').find(':checkbox').prop('checked', !this.checked).trigger('change');
              });

              $('input[name ="label"]').after('<input class="btn defPackMarkDuplicateIncs" value="Doppelte Angriffe"/>').closest('th').attr('colspan', 8).attr('width', '100%');
              $('.defPackMarkDuplicateIncs').click(function () {
                  $('#incomings_table a[href*="screen=info_village"]').each(function () {
                      const coordinates = $(this).text().toCoord().toString();
                      const duplicateCount = $(`#incomings_table a[href*="screen=info_village"]:contains("${coordinates}")`).length;
                      if (duplicateCount > 1) {
                          $(this).css({'background-color': 'red', 'color': 'white'});
                          const id = $(this).closest('tr').find('td:first span.quickedit:first').attr('data-id');
                          const commandMessage = $.trim($(`span.quickedit[data-id="${id}"]`).find('span.quickedit-label').text());
                          let value = null;
                          if (!commandMessage.match(/\[[D]#\d+]/)) {
                              value = commandMessage + ' [D#' + duplicateCount + ']';
                          } else if (commandMessage.match(/\[[D]#\d+]/).toString() !== '[D#' + duplicateCount + ']') {
                              value = commandMessage.replace(/\[[D]#\d+]/, '[D#' + duplicateCount + ']');
                          }
                          if (value !== null) {
                              renameCommand(id, value);
                          }
                      } else {
                          $(this).css({"background-color": "", "color": ""});
                      }
                  });
              });
          }

          addSnipeFunctionalityToIncomingsTable(incomingRows);
          addGroupingFunctionalityToIncomingsTable(incomingRows, taggerSettings);
          makeCompatibleWithToxicDonutIncEnhancer();
      }

      // Expose method
      window.addEnhancedIncomingsTable = () => addEnhancedIncomingsTable();

      function addSnipeFunctionalityToIncomingsTable(incomingRows) {
          $('#incomings_table tr:first th:last').after('<th>Snipe</th>')
          incomingRows.each((i, el) => {
              $(el).find('td:last').after(`<td style="text-align: center"><img class="defPack_snipeFinder" src="${settings.images.snipe}" style="cursor: pointer"/></td>`);
          })
          activateSnipeButtonClickFunction();
      }

      function activateSnipeButtonClickFunction() {
          $('.defPack_snipeFinder').click(function () {
              const tr = $(this).closest('tr');
              const villageToBeSniped = tr.find('td:eq(1)').text().toCoord();
              const targetId = tr.find('td:eq(1) a').attr('href').match(/\d+/g).pop();
              const twDate = tr.find('td:eq(5)').text().trim();

              openSnipeInterface(villageToBeSniped, twDate, targetId, true);
          });
      }

      function addGroupingFunctionalityToIncomingsTable(allFilteredIncomings, taggerSettings) {
          let incomingRows = $('#incomings_table .row_a:visible, #incomings_table .row_b:visible');
          const target = $('#incomings_table th:containsAnyWord(Doel, Target)').index();
          const arrival = $('#incomings_table th:containsAnyWord(Aankomst, Arrival)').index();
          const source = $('#incomings_table th:containsAnyWord(Herkomst, Source)').index();
          const countdownTd = $('#incomings_table th:containsAnyWord(Komt aan, Arrives)').index();
          const activateCheckboxListener = () => $('#incomings_form input:checkbox').on('change', function () {
              const selectedInputs = $('#incomings_table input:checked:not(.snipeSelectedSnipes, .defPack_select_all, #select_all, #selectAll, #select_all_duplicate)');
              $('#defPack_overviewTaggerBtn').text(`Tag ${this.id.indexOf('select') !== -1 ? this.checked ? incomingRows.filter((i, r) => $(r).is(':visible')).length : 0 : selectedInputs.length} commands!`);
          })
          const reactivateTimers = () => {
              Timing.tickHandlers.timers.handleTimerEnd = function () {
                  $(this).closest('tr').remove();
                  allFilteredIncomings = $(allFilteredIncomings).slice(1);
                  incomingRows = $(incomingRows).slice(1);
              };
              Timing.tickHandlers.timers.init();
          }
          const renameIncomingsOverview = () => {
              const allCheckedCommandIds = $('#incomings_table input:checked:not(.snipeSelectedSnipes, .defPack_select_all, #select_all, #selectAll)').map((_, u) => {
                  const id = $(u).attr('name').match(/\d+/).pop();
                  return {
                      text: $(u).closest('tr').find(`span.quickedit[data-id="${id}"] span.quickedit-label`).text().trim(),
                      id: id
                  }
              }).get();

              renameCommandsWithProgressBar(allCheckedCommandIds, 'overviewTaggingProgressBar', 'overviewTaggerText', allFilteredIncomings);
          }

          activateCheckboxListener();

          $('#defPack_overviewTaggerSettings div:first input').click(function () {
              $('#defPack_overviewTaggerText').val($(this).data('rename-to'));
              renameIncomingsOverview();
          });

          $('.defPack_groupBy').click(function () {
              incomingRows = $('#incomings_table .row_a:visible, #incomings_table .row_b:visible').not('.defPack_totalRow');
              $('#incomings_table tr.nowrap').remove();
              const mapCoords = (_, row) => {
                  const selector = `${'target' === $(this).data('group-by') ? target : source}`;
                  const countdown = convertToDate($(row).find(`td:eq(${arrival})`).text());
                  $(row).find(`td:eq(${countdownTd})`).replaceWith(`<td class="sendTime"><span class="timer" data-endtime="${countdown.getTime() / 1000}"></span></td>`);
                  return {
                      coords: $(row).find(`td:eq(${selector}) a`).text().toCoord(),
                      html: $(row)
                  };
              };

              const data = incomingRows.map(mapCoords).get().reduce((arr, obj) => ({
                  ...arr, [obj['coords']]: (arr[obj['coords']] || []).concat(obj)
              }), {})

              let mod = 0;
              const first = $('#incomings_table tbody tr:first');
              Object.entries(data).reverse().forEach(
                  ([key, value]) => {
                      $(first).after(`
              <tr align=right class="nowrap defPack_totalRow row_${mod % 2 === 0 ? 'a' : 'b'}">
                  <td align=left><input data-coords="${key}" type="checkbox" class="defPack_select_all"></td>
                  <td colspan="8">
                      <span style="float: left;"><input type="button" class="defPack_retrieveStackHealth" data-coords="${key}" value="Retrieve stack health"></span>
                      <strong>Angriffe: ${value.length}</strong></td>
              </tr>`);
                      value.reverse().forEach((r) => $(first).after(`<tr data-coords="${key}" class="nowrap row_${mod % 2 === 0 ? 'a' : 'b'}">${r.html.html()}</tr>`) && ++mod);
                  }
              );
              makeCompatibleWithToxicDonutIncEnhancer();
              reactivateTimers();
              activateCheckboxListener();

              $('.defPack_select_all').change(function () {
                  const coords = $(this).data('coords');
                  $(`[data-coords="${coords}"] input:not(#defPack_select_all):not([type=hidden])`).prop('checked', this.checked);
                  $('#defPack_overviewTaggerBtn').text(`Tag ${$('#incomings_table input:checked:not(.snipeSelectedSnipes, .defPack_select_all, #select_all)').length} commands!`);
              });
              $('.defPack_retrieveStackHealth').click(async function () {
                  const element = $(this);
                  const coords = $(element).data('coords');
                  const villageId = $(`tr [data-coords="${coords}"]:first`).find(`td:eq(${target}) a`).attr('href').match(/village=(\d+)/).pop();
                  await twLib.get({url: `${game_data.link_base_pure.replace(/village=\d+/, `village=${villageId}`)}overview`}).then(async (html) => {
                      const incomings = $(html).find('#commands_incomings tbody tr.command-row.no_ignored_command');
                      const wall = parseInt($(html).find('.visual-label-wall').text().match(/\d+/)?.pop() || $(html).find('#l_wall td:eq(1)').text().match(/\d+/)?.pop()) || 0;
                      const stackCheckerSettings = {
                          initialWall: wall,
                          wallParam: `&def_wall=${wall}`
                      };
                      const simulationUrl = await buildSimulationUrl(html, stackCheckerSettings.wallParam, villageId);
                      twLib.get({url: `${simulationUrl}`, dataType: 'html'}).then((response) => {
                          stackCheckerSettings.clearsNeeded = $(response).find('#content_value').find('p').css('font-style', 'italic').find('b').text();
                          stackCheckerSettings.postClear = parseInt($(response).find('th:contains("Schaden durch Rammböcke:")').next().find('b:last-child').text())
                          stackCheckerSettings.totalPopFromSimulation = $(response).find('td:contains("Verteidiger")').closest('tr').find('td:last').first().text();

                          const data = configureHealthCheckValues(stackCheckerSettings, incomings);
                          $(element).after(`
                              <strong style="color: ${data.color}">${data.message}</strong> |
                              ${data.totalAttacks} |
                              Clears - <strong>${(stackCheckerSettings.clearsNeeded.indexOf('meer dan 100') !== -1 ? stackCheckerSettings.clearsNeeded : (data.clears))}</strong> clear(s) |
                              Surplus: <strong style="color: ${data.surplus > 0 ? 'black' : 'red'}">${data.surplus}</strong> clears |
                              <strong style="background-color: ${data.stackColor}"><span class="icon header population"></span> ${stackCheckerSettings.totalPopFromSimulation}</a></strong> |
                              <strong>#1</strong> <img style="vertical-align: bottom;" src="graphic/unit/unit_ram.png" title="" alt=""> clear
                              <img src="graphic/buildings/wall.png" title="" alt="" class=""> <strong>${stackCheckerSettings.initialWall}</strong> -> <strong style="color: ${data.color}"> ${(isNaN(stackCheckerSettings.postClear) ? stackCheckerSettings.initialWall : stackCheckerSettings.postClear)}</strong> |
                              <a href="${simulationUrl}" target="_blank">Simulator</a>
                          `);
                          $(element).remove();
                      })
                  });
              });
              activateSnipeButtonClickFunction();
              addHotKeyRenameCommandOnHover(taggerSettings, '#incomings_table .row_a:visible, #incomings_table .row_b:visible');
          })

          $('#defPack_resetGroup').click(() => {
              $("input:checkbox").prop('checked', false);
              $('#defPack_overviewTaggerBtn').text(`Tag 0 commands!`);
              $('#incomings_table tr.nowrap').remove();
              $('#incomings_table tbody tr:first').after(allFilteredIncomings);
              $("#incomings_table tr:first th:first").text(`Befehle (${allFilteredIncomings.filter((i, r) => $(r).is(':visible')).length})`);

              reactivateTimers();
              activateSnipeButtonClickFunction();
              activateCheckboxListener();
              addHotKeyRenameCommandOnHover(taggerSettings, incomingRows);
          })

          $('#defPack_overviewTaggerBtn').click(function () {
              renameIncomingsOverview();
          });
      }

      const applyDropDownSettings = (property, field, fieldToShow, propertyToSelect) => {
          const isEnabled = snipeSettings[property];
          $(`#${field}`).prop('checked', isEnabled);
          if (isEnabled && fieldToShow) $(`.${fieldToShow}`).show();
          if (propertyToSelect) {
              const selectedValue = parseFloat(snipeSettings[propertyToSelect]) || 0.2;
              $(`.${fieldToShow} option[value="${selectedValue}"]`).attr('selected', 'selected');
          }
      }

      const applySavedSnipeSettings = () => {
          if (snipeSettings) {
              applyDropDownSettings('os_boost_enabled', 'defPack_snipeFinderOsBoostEnabled', 'defPack_snipeFinderOsBoostMultiplier', 'os_boost');

              $(`#defPack_snipeFinderGroup option[value="${snipeSettings.group}"]`).attr('selected', 'selected');
              $('#defPack_ignoreVillagesWithIncsEnabled').prop('checked', snipeSettings.ignore_villages_with_incs);
              $('#defPack_snipeFinderAutomaticallyFillTroops').prop('checked', snipeSettings.automatically_fill_troops);
              Array.from(snipeSettings.units).forEach((u) => $(`.defPack_snipeUnitAmount[data-unit="${u.unit}"]`).css('display', u.enabled ? 'block' : 'none')
                  && $(`.defPack_snipeUnitCheckBox[data-unit="${u.unit}"]`).prop('checked', u.enabled));
          }
      }

      const saveSnipeSetting = (setting, value, index, property) => {
          if (!isNaN(index)) snipeSettings[setting][index][property] = value;
          else snipeSettings[setting] = value;
          localStorage.setItem(settings.storageKeys.snipeSettings, JSON.stringify(snipeSettings));
      }
      const getDistance = (origin, target) => Math.sqrt(Math.pow(origin.x - target.x, 2) + Math.pow(origin.y - target.y, 2));
      const getTravelTime = (distance, unitSpeed) => distance * unitSpeed;

      function openSnipeInterface(villageToBeSniped = '', twDate = '', targetId = '', disabled = false) {
          loadSnipeSettings();

          const resetTargetId = targetId.length < 1;

          TribalWars.get("groups", {ajax: "load_groups"}, function (groups) {
              Dialog.show('SnipeFinder', `
      <div id="defPack_snipePopup">
          <table class="vis" style="width: 100%">
              <tr>
                  <th colspan="2">Snipe Finder <small>- Devil's Def Pack <span style="color: darkblue">v${settings.version}</span></small></th>
              </tr>
              <tr>
                  <td>Use Villages From</td>
                  <td>
                      <select id="defPack_snipeFinderGroup" data-property="group">
                          ${Object.keys(groups.result).map(group => `
                              <option value="${groups.result[group].group_id}">
                                  ${groups.result[group].name}
                              </option>`).join('')}
                       </select>
                  </td>
              </tr>
              <tr>
                  <td>Snipe Coords <span style="color: darkblue">(xxx|xxx)</span></td>
                  <td>
                      <input id="defPack_snipeFinderVillageToSnipe" type="text" value="${villageToBeSniped}">
                  </td>
              </tr>
              <tr>
                  <td>Snipe Time</td>
                  <td>
                      <input id="defPack_snipeFinderTime" type="text" placeholder="dd.mm.yyyy hh:mm:ss:SSS" value="${twDate}" style="width: 99%"/>
                  </td>
              </tr>
              <tr>
                  <td colspan="2">
                      Allowed formats: <span style="color: darkblue">(dd.mm.yyyy hh:mm:ss:SSS / Vandaag om hh:mm:ss:SSS)</span>
                  </td>
              </tr>
              <tr>
                  <td colspan="2">
                      <table class="vis table-responsive" width="100%">
                          <thead>
                              <tr>
                              ${Object.keys(config.unitSpeedSettings).filter((u) => !['militia'].includes(u)).map((unit, index) => `
                                  <th style="text-align: center;" width="35">
                                      <img src="/graphic/unit/unit_${unit}.png" title="${unit}"> <input class="defPack_snipeUnitCheckBox" data-unit="${unit}" data-index="${index}" type="checkbox">
                                  </th>`).join('')}
                              </tr>
                          </thead>
                          <tbody>
                              ${Array.from(snipeSettings.units).filter((u) => !['militia'].includes(u.unit)).map((u, index) => `
                                  <td style="text-align: center;">
                                      <input class="defPack_snipeUnitAmount" data-unit="${u.unit}" type="text" value="${u.amount}" data-index="${index}" size="4">
                                  </td>`).join('')}
                          </tbody>
                      </table>
                  </td>
              </tr>
              <tr>
                  <td>Ignore Villages with incs</td>
                  <td>
                      <input id="defPack_ignoreVillagesWithIncsEnabled" type="checkbox">
                  </td>
              </tr>
              <tr>
                  <td>OS Boost enabled</td>
                  <td>
                      <input id="defPack_snipeFinderOsBoostEnabled" type="checkbox">
                      <select class="defPack_snipeFinderOsBoostMultiplier" data-property="os_boost" style="display: none">
                          ${[...Array(settings.maxOsBoost)].map((_, speed) => `
                              <option value="${(speed + 1) / 100}">
                                  ${speed + 1}%
                              </option>`).join('')}
                      </select>
                  </td>
              </tr>
              <tr>
                  <td>Automatically fill in troops</td>
                  <td>
                      <input id="defPack_snipeFinderAutomaticallyFillTroops" type="checkbox">
                  </td>
              </tr>
              <tr>
                  <td>Format</td>
                  <td>
                      <input id="defPack_snipeTimerFormat" name="snipeOutputFormat" type="radio" value="defPack_snipeTable" checked> Timers
                      <input id="defPack_snipeOffPackFormat" name="snipeOutputFormat" value="defPack_snipeOffPackTextArea" type="radio"> Off Pack
                      <input id="defPack_snipeTwFormat" name="snipeOutputFormat" value="defPack_snipeTwLinkTextArea" type="radio"> TW Links
                  </td>
              </tr>
          </table>
          <input type="button" class="btn" id="defPack_snipeFinderCalculate" value="Calculate Snipes" style="margin-top: 5px; margin-left: 6px; margin-bottom: 5px">
          </br>
          <table class="vis defPack_snipeTable" style="box-shadow: 2px 2px 2px darkgray; border: 2px solid #c1a264; margin-top: 5px;width:100%">
              <tr>
                  <th colspan="8">Snipe possibilities <span id="defPack_snipePossibilities"></span></th>
              </tr>
              <tr>
                  <th style="text-align: center">Source</th>
                  <th style="text-align: center">Target</th>
                  <th style="text-align: center">Available Units</th>
                  <th style="text-align: center">Travel time (<span style="color: darkblue">Launch timer</span>)</th>
                  <th style="text-align: center"><img src="graphic//buildings/place.png" alt="" title="VP"></th>
              </tr>
          </table>
          <textarea class="defPack_snipeOffPackTextArea" cols="100" rows="25" style="display:none; margin-top: 5px;" disabled></textarea>
          <textarea class="defPack_snipeTwLinkTextArea" cols="100" rows="25" style="display:none; margin-top: 5px;" disabled></textarea>
      </div>`);

              applySavedSnipeSettings();

              $('#popup_box_SnipeFinder').css('width', '41%');

              const validateInput = () => {
                  const villageToSnipe = $('#defPack_snipeFinderVillageToSnipe');
                  const snipeTime = $('#defPack_snipeFinderTime');

                  const isEmpty = villageToSnipe.val().trim() === '' || snipeTime.val().trim() === '';
                  const invalidInputs = villageToSnipe.val().match(/\d{1,3}\|\d{1,3}/g) === null
                      || (!snipeTime.val().match(/(\d+.\d+.\d+)\s+(\d+:\d+:\d+:\d+)/) && !snipeTime.val().match(/\d+:\d+:\d+:\d+/));
                  $('#defPack_snipeFinderCalculate').prop('disabled', isEmpty || invalidInputs);
              }

              if (!disabled) {
                  $('#defPack_snipeFinderCalculate').prop('disabled', true);
                  $('#defPack_snipeFinderVillageToSnipe, #defPack_snipeFinderTime').on('keyup', validateInput);
              }
              $('.defPack_snipeUnitCheckBox').click(function () {
                  saveSnipeSetting('units', this.checked, $(this).data('index'), 'enabled');
                  $(`.defPack_snipeUnitAmount[data-unit="${$(this).data('unit')}"]`).css('display', this.checked ? 'block' : 'none')
              });
              $('.defPack_snipeUnitAmount').change(function () {
                  saveSnipeSetting('units', parseInt($(this).val()), $(this).data('index'), 'amount');
              });
              $('#defPack_slowestUnitEnabled').click((event) => {
                  saveSnipeSetting('slowest_unit_enabled', event.target.checked);
                  $('.defPack_slowestUnit').toggle();
              });
              $('#defPack_snipeFinderOsBoostEnabled').change((event) => {
                  saveSnipeSetting('os_boost_enabled', event.target.checked)
                  $('.defPack_snipeFinderOsBoostMultiplier').toggle();
              });
              $('#defPack_ignoreVillagesWithIncsEnabled').change((event) => {
                  saveSnipeSetting('ignore_villages_with_incs', event.target.checked);
              });
              $('#defPack_snipeFinderAutomaticallyFillTroops').change((event) => {
                  saveSnipeSetting('automatically_fill_troops', event.target.checked);
              });
              $('.defPack_snipeFinderOsBoostMultiplier, #defPack_snipeFinderGroup').change(function () {
                  saveSnipeSetting($(this).data('property'), $(this).val());
              })
              $('#defPack_snipeFinderVillageToSnipe, #defPack_snipeFinderTime').prop('disabled', disabled);
              $('#defPack_snipeFinderCalculate').click(async () => {
                  const selectedGroup = $('#defPack_snipeFinderGroup').val();
                  villageToBeSniped = $('#defPack_snipeFinderVillageToSnipe').val();

                  if (targetId === '') {
                      targetId = await getTargetIdFromCoordinates(villageToBeSniped);
                  }

                  $.when(loadProductionOverview('combined', selectedGroup)).done(function (html) {
                      $('.defPack_snipeRow').remove();
                      twDate = $('#defPack_snipeFinderTime').val();
                      // dd.mm.yyyy hh:MM:ss:SSS support
                      const matchDateFormat = twDate.match(/(\d+.\d+.\d+)\s+(\d+:\d+:\d+:\d+)/);
                      let timeTobeSnipedAt = convertToDate(twDate);

                      if (matchDateFormat) {
                          const matchDateFormatElement = matchDateFormat[0];
                          // Check if date is formatted as dd.mm.yy not dd.mm.yyyy
                          if (matchDateFormatElement.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/g)) {
                              timeTobeSnipedAt = new Date(matchDateFormatElement.replace(/(\d{1,2})\.(\d{1,2})\.(\d{4})/g, '$3-$2-$1'));
                          } else {
                              timeTobeSnipedAt = new Date(new Date().getFullYear() + '-' + matchDateFormatElement.replace(/(\d{1,2})\.(\d{1,2})\.(\d{1,4})/g, '$2-$1'));
                          }
                      }
                      const osBoostEnabled = $('#defPack_snipeFinderOsBoostEnabled').is(':checked');
                      const ignoreVillagesWithIncs = $('#defPack_ignoreVillagesWithIncsEnabled').is(':checked');
                      const snipeUnits = Array.from(snipeSettings.units).filter((u) => u.enabled && u.amount > 0);
                      if (snipeUnits.length === 0) {
                          $('#defPack_snipePossibilities').text(`(0)`);
                          return;
                      }
                      const slowestSelectedUnit = snipeUnits.sort((a, b) => parseFloat(config.unitSpeedSettings[a.unit]) < parseFloat(config.unitSpeedSettings[b.unit]) ? 1 : -1)[0];

                      let villages = $(html).find('#combined_table .row_a, .row_b');
                      if (ignoreVillagesWithIncs) {
                          villages = $(villages).not(':has(img[src*="attack"])');
                      }
                      const headerRow = $(html).find(`#combined_table tr:first th`);
                      const unitIndexes = game_data.units.map((u) => {
                          return {
                              unit: u,
                              speed: parseFloat(config.unitSpeedSettings[u]),
                              index: $(headerRow).find(`img[src*=${u}]`).closest('th').index()
                          }
                      });
                      let offPackTextArea = new Set();
                      let twLinkFormatTextArea = new Set();

                      villages.sort(((a, b) => {
                          const distanceA = getDistance(coordToObject($(a).find('.quickedit-label').text()), coordToObject(villageToBeSniped));
                          const distanceB = getDistance(coordToObject($(b).find('.quickedit-label').text()), coordToObject(villageToBeSniped));
                          return distanceA > distanceB ? 1 : -1;
                      })).each(function () {
                          const villageId = $(this).find('.quickedit-vn').data('id');
                          const coordinates = $(this).find('.quickedit-label').text();
                          const distance = getDistance(coordToObject(coordinates), coordToObject(villageToBeSniped));

                          const snipeUnitShouldBeAvailableInCurrentVillage = (snipeUnit) => availableUnits.filter((availableUnit) => availableUnit.unit === snipeUnit.unit && availableUnit.available >= snipeUnit.amount).length > 0;
                          const unitSpeed = parseFloat(config.unitSpeedSettings[slowestSelectedUnit.unit]);
                          const availableUnits = unitIndexes.map((u) => {
                              return {
                                  ...u,
                                  available: parseInt($(this).find(`td:eq(${u.index})`).text())
                              }
                          }).filter((u) => u.available > 0 && u.speed <= unitSpeed);
                          if (!snipeUnits.every(snipeUnitShouldBeAvailableInCurrentVillage) || availableUnits.length < 1) return;

                          let travelTime = getTravelTime(distance, unitSpeed);
                          if (osBoostEnabled) {
                              travelTime /= 1 + parseFloat($('.defPack_snipeFinderOsBoostMultiplier').val()) || 0.2; //20% os boost

                          }
                          const dateTillLaunch = new Date(timeTobeSnipedAt.getTime() - travelTime * 60 * 1000);
                          const timeUntilLaunch = dateTillLaunch.getTime() - new Date().getTime();
                          if (timeUntilLaunch <= 0 || distance <= 0) return;

                          let targetUrl = `game.php?village=${villageId}&screen=place&target=${targetId}&arrivalTimestamp=${timeTobeSnipedAt.getTime()}&type=${snipeSettings.automatically_fill_troops ? 'snipe' : 'support'}`;
                          if (game_data.player.sitter > 0) {
                              targetUrl += `&t=${game_data.player.id}`;
                          }

                          offPackTextArea.add(
                              `${coordinates.toCoord()}->${villageToBeSniped.toCoord()},${distance.toFixed(2)},${slowestSelectedUnit.unit},Support,${formatTimes(new Date(timeTobeSnipedAt.getTime()))},${Format.timeSpan(60 * 1000 * travelTime, !0)},${formatTimes(new Date(dateTillLaunch))}`
                          );
                          twLinkFormatTextArea.add(
                              `${availableUnits.map((u) => `[unit]${u.unit}[/unit] ${u.available}`).join(' ')} | ${formatTimes(new Date(dateTillLaunch), true)} | ${formatTimes(new Date(timeTobeSnipedAt.getTime()))} | ${coordinates.toCoord()} -> ${villageToBeSniped.toCoord()} | [url=${targetUrl}][building]place[/building][/url]`
                          );
                          $('.defPack_snipeTable tr:eq(1)').after(
                              `<tr class="defPack_snipeRow">
                                  <td style="text-align: center"><a target="_blank" href="${game_data.link_base_pure}info_village&id=${villageId}">${coordinates.toCoord()}</a></td>
                                  <td style="text-align: center"><a target="_blank" href="${game_data.link_base_pure}info_village&id=${targetId}">${villageToBeSniped.toCoord()}</a></td>
                                  <td style="text-align: center">${availableUnits.map((u) => `<img src="/graphic/unit/unit_${u.unit}.png"> ${u.available}`).join(' ')}</td>
                                  <td style="text-align: center">${Format.timeSpan(60 * 1000 * travelTime, !0)} <b>(<span class="timer" style="color: darkblue" data-endtime="${dateTillLaunch.getTime() / 1000}"></span>)</b></td>
                                  <td style="text-align: center"><a target="_blank" href="${targetUrl}"><img src="graphic//buildings/place.png" alt="" title="VP"></td>
                              </tr>`
                          );
                      })
                      if (offPackTextArea.size < 1) {
                          UI.ErrorMessage('No Snipes found!');
                      }
                      Timing.tickHandlers.timers.handleTimerEnd = function () {
                          $(this).closest('tr').remove();
                      };
                      Timing.tickHandlers.timers.init();
                      $(window.TribalWars).off().on("global_tick", function () {
                          document.title = 'Next snipe: ' + $('.defPack_snipeTable').find('[data-endtime]:first').text();
                      });
                      $('#defPack_snipePossibilities').text(`(${offPackTextArea.size})`);
                      $('.defPack_snipeOffPackTextArea').text(Array.from(offPackTextArea).reverse().join('\n'));
                      $('.defPack_snipeTwLinkTextArea').text(Array.from(twLinkFormatTextArea).reverse().join('\n'));
                      if (resetTargetId) targetId = '';
                  });
              })

              $('input[name="snipeOutputFormat"]').change(function () {
                  $('.defPack_snipeTable, .defPack_snipeOffPackTextArea, .defPack_snipeTwLinkTextArea').hide();
                  $(`.${$(this).val()}`).show();
              });
          });
      }

      async function getTargetIdFromCoordinates(village) {
          return new Promise((resolve, reject) => {
              TribalWars.get("api", {
                  ajax: "target_selection",
                  async: true,
                  input: village.toCoord(),
                  limit: 1,
                  offset: 0,
                  request_id: 1,
                  type: "coord"
              }, function (target) {
                  resolve(target.villages[0].id);
              });
          })
      }

      function formatTimes(d, bold = false) {
          const pad = (num, size) => ('000' + num).slice(size * -1);

          let formattedTime = d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + (d.getDate())).slice(-2) + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":" + ("0" + d.getSeconds()).slice(-2) + "." + pad(d.getMilliseconds(), 3);
          return bold ? formattedTime.replace(/\d+:\d+:\d+.\d+/, '[b]$&[/b]') : formattedTime;
      }

      function convertToDate(twDate) {
          const t = twDate.match(/\d+:\d+:\d+.\d+/) ?? twDate.match(/\d+:\d+:\d+/);
          const serverDate = $('#serverDate').text().replace(/\//g, '-').replace(/(\d{1,2})-(\d{1,2})-(\d{4})/g, '$3-$2-$1');
          let date = new Date(serverDate + ' ' + t);

          if (twDate.match('morgen')) {
              date.setDate(date.getDate() + 1);
              return date;
          } else if (twDate.match(/\d+\.\d+/)) {
              let monthDate = twDate.match(/\d+\.\d+/)[0].split('.');
              return new Date(date.getFullYear() + '-' + monthDate[1] + '-' + monthDate[0] + ' ' + t);
          } else {
              return date;
          }
      }

      function addSnobIncomingsTableDetail(incomings, type, row) {
          incomings[type] = row;
          const snobMainRow = row.parent().next().find('img[src*="snob.png"]');
          incomings[type + 'Snobs'] = snobMainRow;
          incomings[type + 'SnobsOK'] = snobMainRow.closest('td').find('.quickedit-label:containsAnyWord(OK, SNIPED)');
          incomings[type + 'SnobsCheck'] = snobMainRow.closest('td').find('.quickedit-label:containsAnyWord(CHECK)');
          incomings[type + 'SnobsNOK'] = snobMainRow.closest('td').find('.quickedit-label:not(:containsAnyWord(OK, SNIPED, CHECK))');
      }

      function getUniquePlayers() {
          let uniquePlayers = new Set();
          if ($('#incomings_table a[href*="id=0"]').closest('td').prev('td:visible').length > 0) {
              uniquePlayers.add('Bolwerk');
          }
          $('#incomings_table tr a[href*="screen=info_player"]:visible:not(a[href*="id=0"])').each(function () {
              if ($(this).text().toString() !== '') {
                  uniquePlayers.add($(this).text().toString());
              }
          });
          return uniquePlayers;
      }

      function refreshIncsPerPlayer() {
          let total = 0;
          let htmlRows = [];

          getUniquePlayers().forEach(function (player) {
              let incsByPlayerTotal = $(`#incomings_table a[href*="screen=info_player"]:visible:contains("${player}")`);
              let playerLink;
              if (player !== 'Bolwerk') {
                  playerLink = incsByPlayerTotal.first().attr('href').match(/id=(\d+)/)[1];
              } else {
                  incsByPlayerTotal = $('#incomings_table a[href*="id=0"]');
              }
              htmlRows.push(`<tr class="defPack_playerRow"><td width="40%"><a target="_blank" href="${window.location.origin}/game.php?screen=info_player&id=${playerLink}">${player}</a></td><td colspan="4"><a style="cursor: pointer" class="defPackFilterPlayer">${incsByPlayerTotal.length}</a><br></td></tr>`);
              total += incsByPlayerTotal.length;
          });

          let incsPerDayHtml = [];
          const arrivalTdIndex = $('#incomings_table th:containsAnyWord(Aankomst, Arrival)').index();
          getUniqueDays().forEach(function (day) {
              let incsByDayTotal = $('#incomings_table tr').find(`td:eq(${arrivalTdIndex}):visible:contains("${day}")`).length;
              incsPerDayHtml.push(`<tr class="defPack_dayRow"><td data-day="${day}">${day}</td><td><a style="cursor: pointer" class="defPack_filterDay">${incsByDayTotal}</a><br></td></tr>`);
          });

          $('#defPack_incsWallUnder20Header').click(function () {
              $.when(loadProductionOverview('buildings')).done(function (html) {
                  let allIncomings = $('#incomings_table .row_a, #incomings_table .row_b').find('td:eq(1)').map(function () {
                      return $(this).text().match(/\d+\|\d+/)
                  }).get();
                  let incomingsWallUnder20 = $(html).find('.b_wall').filter(function () {
                      return parseInt($(this).text()) < 20
                  }).map(function () {
                      return $(this).parent().find('.quickedit-label').text().match(/\d+\|\d+/);
                  }).get();
                  const filtered = allIncomings.filter(village => incomingsWallUnder20.includes(village));
                  $('#defPack_incs_wallUnder20Content').replaceWith(
                      `<td><span class="icon header village"></span> Villages</td>
           <td colspan="4"><strong><a style="cursor: pointer;" id="defPackFilter_wallUnder20">${new Set(filtered).size}</a></td>
          `);
                  $('#defPackFilter_wallUnder20').click(function () {
                      $('#incomings_table tr').not(':last').not(':first').hide();
                      filtered.map((vil) => $('#incomings_table .row_a, #incomings_table .row_b').find('a:contains("' + vil + '")')).forEach((vil) => vil.closest('tr').show());
                      refreshIncsPerPlayer();
                  })
              });
          });
          $('.defPack_playerRow, .defPack_dayRow').remove();
          $('#defPack_incsPerPlayer').prepend(`${Object.keys(htmlRows).map(key => (htmlRows[key])).join('')}`);
          $('#defPack_incsPerPlayer').append(`${Object.keys(incsPerDayHtml).map(key => (incsPerDayHtml[key])).join('')}`);
          $("#incomings_table tr:first th:first").text(`Befehle (${total})`);
          $('.defPackFilterPlayer').click(function () {
              const player = $(this).closest('tr').find('td:first a[href*="screen=info_player"]').text();
              $('#incomings_table tr').not(':last').not(':first').hide();
              if (player === 'Bolwerk') {
                  $('#incomings_table a[href*="id=0"]').closest('tr').show();
              } else {
                  const selectedPlayer = $('#playerNames strong.group-menu-item').data('id');
                  $(`#incomings_table a[href*="screen=info_player"]:contains("${player}")`).closest(isNaN(selectedPlayer) ? 'tr' : `tr.${selectedPlayer}`).show();
              }

              refreshIncsPerPlayer();
          });

          $('#playerNames .group-menu-item').click(() => refreshIncsPerPlayer());

          $('.defPack_filterDay').click(function () {
              const day = $(this).closest('tr').find('td:first').data('day');
              $(`#incomings_table tr`).not(':last').not(':first').hide().find(`td:eq(5):contains("${day}")`).closest('tr').show();

              refreshIncsPerPlayer();
          })
      }

      function getUniqueDays() {
          return new Set($('#incomings_table td:nth-child(6):visible').map((_, element) => $(element).text().getDateString()).get());
      }

      function loadNextPageIncomings(firstRun, html) {
          const incomingRows = $(html).find('#incomings_table .row_a, #incomings_table .row_b');
          const snobs = $(html).find('#incomings_table img[src*="snob.png"]');

          const totalFilter = $('#defPackFilterReset');
          const newTotal = firstRun ? incomingRows.length : parseInt(totalFilter.text()) + incomingRows.length;
          totalFilter.text(newTotal);

          const snobsFilter = $('#defPackFilter_snobs');
          const newTotalSnobs = firstRun ? snobs.length : parseInt(snobsFilter.text()) + snobs.length || 0;
          snobsFilter.text(newTotalSnobs);

          const greenAttacks = $(incomingRows).find('img[src*="graphic/command/attack_small.png"]');
          recalculateNumbers(firstRun, $('#defPackFilter_green'), greenAttacks.length, newTotal)
          recalculateNumbers(firstRun, $('#defPackFilter_greenSnobs'), greenAttacks.parent().next().find('img[src*="snob.png"]').length, newTotalSnobs)
          recalculateNumbers(firstRun, $('#defPackFilter_greenSnobsOK'), greenAttacks.parent().next().find('img[src*="snob.png"]').closest('td').find('.quickedit-label:containsAnyWord(OK, SNIPED)').length, newTotalSnobs)
          recalculateNumbers(firstRun, $('#defPackFilter_greenSnobsCheck'), greenAttacks.parent().next().find('img[src*="snob.png"]').closest('td').find('.quickedit-label:containsAnyWord(CHECK)').length, newTotalSnobs)
          recalculateNumbers(firstRun, $('#defPackFilter_greenSnobsNOK'), greenAttacks.parent().next().find('img[src*="snob.png"]').closest('td').find('.quickedit-label:not(:containsAnyWord(OK, SNIPED, CHECK))').length, newTotalSnobs)

          const orangeAttacks = $(incomingRows).find('img[src*="graphic/command/attack_medium.png"]');
          recalculateNumbers(firstRun, $('#defPackFilter_orange'), $(incomingRows).find('img[src*="graphic/command/attack_medium.png"]').length, newTotal)
          recalculateNumbers(firstRun, $('#defPackFilter_orangeSnobs'), orangeAttacks.parent().next().find('img[src*="snob.png"]').length, newTotalSnobs)
          recalculateNumbers(firstRun, $('#defPackFilter_orangeSnobsOK'), orangeAttacks.parent().next().find('img[src*="snob.png"]').closest('td').find('.quickedit-label:containsAnyWord(OK, SNIPED)').length, newTotalSnobs)
          recalculateNumbers(firstRun, $('#defPackFilter_orangeSnobsCheck'), orangeAttacks.parent().next().find('img[src*="snob.png"]').closest('td').find('.quickedit-label:containsAnyWord(CHECK)').length, newTotalSnobs)
          recalculateNumbers(firstRun, $('#defPackFilter_orangeSnobsNOK'), orangeAttacks.parent().next().find('img[src*="snob.png"]').closest('td').find('.quickedit-label:not(:containsAnyWord(OK, SNIPED, CHECK))').length, newTotalSnobs)

          const redAttacks = $(incomingRows).find('img[src*="graphic/command/attack_large.png"]');
          recalculateNumbers(firstRun, $('#defPackFilter_red'), $(incomingRows).find('img[src*="graphic/command/attack_large.png"]').length, newTotal)
          recalculateNumbers(firstRun, $('#defPackFilter_redSnobs'), redAttacks.parent().next().find('img[src*="snob.png"]').length, newTotalSnobs)
          recalculateNumbers(firstRun, $('#defPackFilter_redSnobsOK'), redAttacks.parent().next().find('img[src*="snob.png"]').closest('td').find('.quickedit-label:containsAnyWord(OK, SNIPED)').length, newTotalSnobs)
          recalculateNumbers(firstRun, $('#defPackFilter_redSnobsCheck'), redAttacks.parent().next().find('img[src*="snob.png"]').closest('td').find('.quickedit-label:containsAnyWord(CHECK)').length, newTotalSnobs)
          recalculateNumbers(firstRun, $('#defPackFilter_redSnobsNOK'), redAttacks.parent().next().find('img[src*="snob.png"]').closest('td').find('.quickedit-label:not(:containsAnyWord(OK, SNIPED, CHECK))').length, newTotalSnobs)

          recalculateNumbers(firstRun, $('#defPackFilter_unknown'), $(incomingRows).find('img[src*="graphic/command/attack.png"]').length, newTotal)
          recalculateNumbers(firstRun, $('#defPackFilter_noTag'), incomingRows.find('td .quickedit-label:contains("Angriff")').length, newTotal)
          recalculateNumbers(firstRun, $('#defPackFilter_ok'), incomingRows.find('td .quickedit-label:containsAnyWord(OK, SNIPED)').length, newTotal)
          recalculateNumbers(firstRun, $('#defPackFilter_nok'), incomingRows.find('td .quickedit-label:not(:containsAnyWord(OK, SNIPED,))').length, newTotal)
      }

      function recalculateNumbers(firstRun, oldValues, newValues, total) {
          newValues = firstRun ? newValues : parseInt(oldValues.text()) + newValues;
          oldValues.text(newValues);
          oldValues.parent().next('span').text(` (${(newValues / total * 100 || 0).round(2)}%)`)
      }

      function renameCommand(id, value, async) {
          return twLib.post({
              url: `${game_data.link_base_pure}info_command&ajaxaction=edit_other_comment&id=${id}&h=${game_data.csrf}`,
              async: async ? async : false,
              data: {text: value},
              success: function () {
                  $(`span.quickedit[data-id="${id}"]`).find('span.quickedit-label').text(value);
              }
          });
      }

      function renameCommandWithTagSetting(command, value, taggerSettings) {
          renameCommand(command.id, value);
          const tagSetting = Object.values(taggerSettings).find((setting) => value.includes(setting.tag));
          $(command.taggedSpan).css('background-color', tagSetting?.color ?? '#efefef');
      }

      async function buildSimulationUrl(html, wallParam, villageId) {
          let units = game_data.units;
          if (userData.ignoreScoutsInStackHealthCheck) {
              units = units.filter(item => item !== 'spy');
          }
          const troops = units.reduce((obj, unit) => {
              const selector = html === document ? 'visible' : 'first'; // Sangu fix
              let amount = $(html).find(`.all_unit [data-count="${unit}"]:${selector}`).get().reduce((a, b) => a + parseInt($(b).text()), 0) + (parseInt($(html).find(`#os_units\\+ [data-unit="${unit}"]`).closest('td').find('b').text().replace('.', '')) || 0);
              if (userData.ignoreOwnTroopsInStackHealthCheck) {
                  amount -= $(html).find(`.home_unit [data-count="${unit}"]`).get().reduce((a, b) => a + parseInt($(b).text()), 0);
              }
              obj[unit] = amount;
              return obj;
          }, {});
          await addIncomingTroopsToSimulationData(html, troops, villageId);
          return `${game_data.link_base_pure}place${buildQueryParamsForSimulationCall(html, troops, wallParam)}`;
      }

      async function addIncomingTroopsToSimulationData(html, troops, villageId) {
          let showIncomingUnits = $(html).find('#show_incoming_units');
          if ($(html).find("#show_incoming_units [data-command-type=support]").length > 0) {
              const incomingsElement = $(html).find('#commands_incomings');
              const allRows = incomingsElement.find('tr.command-row.no_ignored_command');
              const incomingSupports = await getTotalIncomingOsData(villageId);

              showIncomingUnits.before(`<div id="incoming_os_sum_table" class="vis moveable widget"><h4 class="head with-button"><img src="graphic/command/support.png" alt=""> Eintreffende UT <img src="graphic/command/support.png" alt=""></h4><div class="widget_content" style="display: block">${incomingSupports}</div></div>`);
              $(html).find('#support_sum').css('text-align', 'center');

              const indexFirstAttack = $(allRows).find('img[src*="attack"]').closest('tr').first().index();
              const indexLastSupport = $(allRows).find('img[src*="support"]').closest('tr').last().index();
              const incomingSupportCommandsBeforeFirstAttack = $(incomingsElement)
                  .find(`tr:lt(${indexFirstAttack}).command-row.no_ignored_command img[src*="support"]`).closest('tr')
                  .map((_, el) => $(el).find('.command_hover_details').attr('data-command-id')).get();

              if (indexLastSupport < indexFirstAttack || indexFirstAttack === -1) {
                  $(incomingSupports).find('td').each((i, el) => troops[$(el).attr('data-unit')] += parseInt($(el).text()) || 0);
              } else {
                  for (const command of incomingSupportCommandsBeforeFirstAttack) {
                      Object.entries(await getIncomingSupportDataFor(command)).forEach(([key, value]) => troops[key] += parseInt(value.count))
                  }
              }
          }
      }

      function buildQueryParamsForSimulationCall(html, troops, wallParam) {
          let queryParams = `&mode=sim&simulate${wallParam}`;
          Object.entries(troops).forEach(([unit, amount]) => queryParams += `&def_${unit}=${amount}`);
          Object.entries(userData.clear_data).forEach(([unit, amount]) => queryParams += `&att_${unit}=${amount}`);

          queryParams += "&def_benefits=";
          let input = [];
          let includeNight = false;
          let showEffects = $(html).find('#show_effects');

          showEffects.find('.effect_tooltip.village_overview_effect img').each(function () {
              let unit = $(this).attr('src').split('/').pop().replace('.png', '');
              let data = settings.boostData[unit];
              if (unit === 'night') {
                  includeNight = true;
              }
              if (data) {
                  let amount = parseInt($(this).parent().text().trim().match(/\d+/g));
                  if (data.description) {
                      addBoost(input, data.type, amount, unit.split('_').pop(), data.description);
                  } else {
                      addBoost(input, data.type, amount);
                  }
              }
          });
          queryParams += encodeURIComponent(JSON.stringify(input));

          queryParams += "&att_benefits=";
          input = [];
          // For non archer worlds
          if (userData.offBoosts['marcher'] && !game_data.units.includes('archer')) {
              delete userData.offBoosts["marcher"];
          }
          Object.entries(userData.offBoosts).forEach(([boost, amount]) => addBoost(input, settings.boostData[`unit_${boost}`].type, amount, boost, settings.boostData[`unit_${boost}`].description));
          queryParams += encodeURIComponent(JSON.stringify(input));

          if (userData.nightEnabled && includeNight) queryParams += '&night=on';
          queryParams += '&belief_def=on&belief_att=on';
          let flag = showEffects.find('.village_overview_effect img[src*="flags"]').first().closest('td').find('a').text().trim();
          if (flag.indexOf('verdediging') !== -1) {
              queryParams += '&def_flag=' + parseInt(flag.match(/\d+/g) - 1);
          }
          if (userData.offFlag || 0 > 0) {
              queryParams += '&att_flag=' + userData.offFlag;
          }
          if (config.worldSettings?.farm_limit) {
              queryParams += `&def_farm=${game_data.village.buildings.farm}`;
          }
          if (config.worldSettings?.tech === settings.tech.LEVELS) {
              Object.entries(userData.offTechLevels).forEach(([unit, amount]) => queryParams += `&att_tech_${unit}=${amount}`);
              if (techLevels[game_data.village.id]) {
                  Object.entries(techLevels[game_data.village.id]).forEach(([unit, amount]) => queryParams += `&def_tech_${unit}=${amount}`);
              } else {
                  $.when(twLib.get({url: settings.tech.url})).done((html) => cachePlayerTechLevels(html));
              }
          }
          return queryParams;
      }

      function addBoost(input, type, amount, unit, description) {
          let boost = {inputs: [], type: type};

          if (amount != null) boost.inputs.push(amount || 0);
          if (unit != null) boost.inputs.push(unit);
          if (description != null) boost.inputs.push(description);

          input.push(boost);
      }

      function configureHealthCheckValues(stackCheckerSettings, incomings) {
          const pop = parseInt(stackCheckerSettings.totalPopFromSimulation.replace('.', '')) || 0;
          const clears = recalculateClearsNeeded(stackCheckerSettings);
          const incomingClearCounter = [
              {type: 'attack_small', multiplier: 0.1},
              {type: 'attack_medium', multiplier: 0.5},
              {type: 'attack_large', multiplier: 1},
              {type: 'attack', multiplier: 1},
          ].reduce((a, attack) => a + (incomings.find(`img[src*="graphic/command/${attack.type}.png"]`).length * attack.multiplier), 0);
          const stackData = incomingClearCounter > 0 ? userData.incoming_stack_data : userData.stack_data;
          const stackHealth = Object.values(stackData).filter((data) => clears - incomingClearCounter >= data.clears).shift() || stackData['NOK'];
          const stackColor = Object.values(stackData).filter((data) => pop >= data.population).shift() || userData.stack_data['NOK'];
          const totalAttacks = ['attack_small', 'attack_medium', 'attack_large', 'attack']
              .map((type) => `<strong>${incomings.find(`img[src*="graphic/command/${type}.png"]`).length}</strong> <img src="graphic/command/${type}.png">`);
          return {
              clears: clears,
              surplus: clears - incomingClearCounter,
              color: stackHealth.color,
              message: stackHealth.message,
              stackColor: stackColor.bgColor,
              totalAttacks: `<strong>${incomingClearCounter}</strong> Angriffe ${totalAttacks} `,
          };
      }

      function recalculateClearsNeeded(stackCheckerSettings) {
          let clears = stackCheckerSettings.clearsNeeded.indexOf('meer dan 100') !== -1 ? 100 : parseInt(stackCheckerSettings.clearsNeeded) || 0;
          if ((parseInt(stackCheckerSettings.totalPopFromSimulation.replace('.', '')) || 0) > 10000) {
              clears += 1;
          }
          return clears;
      }

      function calculateSupportPopulationPreview() {
          let totalPopulation = 0;
          let totalUnitPopAmount = {};
          const checkedVillages = $("#village_troup_list tr:not(:first) input[type=checkbox]:checked");
          const requestOsTable = $('#defPack_requestOSTable tbody');

          checkedVillages.each(function () {
              $(this).closest('tr').find('td').slice(2, -1).each(function () {
                  const input = $(this).find('input');
                  const unit = input.parent().attr('data-unit');
                  const amount = (parseInt(input.val()) || 0);
                  totalPopulation += amount * settings.troopPop[unit];
                  totalUnitPopAmount[unit] = amount + (totalUnitPopAmount[unit] || 0);
              });
          });

          requestOsTable.empty();
          requestOsTable.append(`<tr>${Object.keys(totalUnitPopAmount).map(unit => `<td data-unit="${unit}">${Format.number(totalUnitPopAmount[unit])}</td>`).join('')}<td>${Format.number(totalPopulation)}</td></tr>`);
      }

      function filterVillages(slowestUnit, arrivalTime) {
          let counter = 0;
          const checked = $('#defPack_callScreenFilterVillages').is(':checked');

          if (checked) {
              $('.call-village').each(function () {
                  const durationInMilliseconds = $(this).find(`[data-unit=${slowestUnit.unit}]`)
                      .prop('tooltipText')
                      .match(/\d+:\d+:\d+/).pop()
                      .split(':')
                      .reduce((acc, time) => (60 * acc) + +time) * 1000;
                  const dateTillLaunch = new Date((arrivalTime * 1000) - durationInMilliseconds);
                  const timeUntilLaunch = dateTillLaunch.getTime() - new Date().getTime();

                  if (timeUntilLaunch <= 0) {
                      ++counter;
                      $(this).find('td:last input').removeClass('troop-request-selector');
                      $(this).hide();
                  } else {
                      $(this).find('td:last input').addClass('troop-request-selector');
                      $(this).show();
                  }
              });

              $('#defPack_callScreenTable tr:eq(1)').replaceWith(`
                  <tr>
                      <td colspan="6">
                          <div class="info_box">
                              Removed <strong>${counter}</strong> villages. Slowest unit <img style="vertical-align: sub;" src="graphic/unit/unit_${slowestUnit.unit}.png">. Time until selected attack <b>(<span style="color: darkblue" class="timer" data-endtime="${arrivalTime}"></span>)</b)
                          </div>
                      </td>
                  </tr>`
              );
          } else {
              $('.call-village').each((element) => $(element).find('td:last input').addClass('troop-request-selector') && $(element).show());
              $('#defPack_callScreenTable tr:eq(1)').hide();
          }
          Timing.tickHandlers.timers.init();
      }

      function getSlowestUnit() {
          return $('.unit_checkbox:checked').map(function () {
              const unitName = $(this).attr('id').split('checkbox_')[1];
              return {unit: unitName, speed: parseFloat(config.unitSpeedSettings[unitName])};
          }).get().sort(((a, b) => (a.speed > b.speed ? -1 : 1)))[0];
      }

      function createOptions(rows) {
          return rows.map((item) => {
              const arrivalTime = parseInt($(item).find('[data-endtime]').data('endtime'));
              const command = $(item).find('.quickedit-label').text().trim();
              return `<option value="${arrivalTime}">${command + " -> " + Format.date(arrivalTime, !0, !0, !0, !1)}</option>`;
          }).join('\n');
      }

      function refreshCoordList(coords, id = 'defPack_mapTaggerTextArea') {
          $('#defPack_mapMassSupportLink').attr('href', `${game_data.link_base_pure}place&mode=call&group=0&page=-1&sources=${Array.from(coords.values()).map((s) => s.id).join(',')}`)
          $(`#${id}`).text(
              Array.from(coords.values(), c => c.coords)
                  .filter((x, i, a) => a.indexOf(x) === i)
                  .join('\n')
          );
      }
  }
)
();

} else {
    console.log('Sie haben keine Lizenz');
  }
})
.catch(error => {
  console.error('Ein Fehler ist aufgetreten:', error);
});
