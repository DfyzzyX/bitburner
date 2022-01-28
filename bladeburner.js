/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog('ALL');

	const cycle = [0, '▄', '█', '▀', '█'];

	var start = new Date();

	// [chaos, communities, population, last_checked_data]
	const cityInitData = [0, 0, 0, start];

	//[name, cityData]
	var cities = [
		['Sector-12', cityInitData],
		['Aevum', cityInitData],
		['Volhaven', cityInitData],
		['Chongqing', cityInitData],
		['New Tokyo', cityInitData],
		['Ishima', cityInitData]
	];

	//[type, actionName, cycles]
	const initPlanStep = ['', '', 0];

	var plan = [
		initPlanStep
	];

	var planLog = [
		initPlanStep
	];

	const prefSkills = [
		'Hyperdrive', 'Tracer', 'Short-Circuit', 'Cloak', `Blade's Intuition`, 'Digital Observer', 'Reaper', 'Evasive System'
	];

	//[name, rank, type]
	const allBO = [
		['Operation Typhoon', 2500], //ret
		['Operation Zero', 5000], //stealth
		['Operation X', 7500], //ret
		['Operation Titan', 10000], //ret
		['Operation Ares', 12500], //ret
		['Operation Archangel', 15000], //ret
		['Operation Juggernaut', 20000], //ret
		['Operation Red Dragon', 25000], //ret
		['Operation K', 30000], //ret
		['Operation Deckard', 40000], //ret
		['Operation Tyrell', 50000], //ret
		['Operation Wallace', 75000], //ret
		['Operation Shoulder of Orion', 100000], //stealth
		['Operation Hyron', 125000], //ret
		['Operation Morpheus', 150000], //stealth
		['Operation Ion Storm', 175000], //ret
		['Operation Annihilus', 200000], //ret
		['Operation Ultron', 250000], //ret
		['Operation Centurion', 300000], //none
		['Operation Vindictus', 350000], //none
		['Operation Daedalus', 400000] //none
	];

	const allOps = [
		'Investigation', 'Undercover Operation', 'Sting Operation', 'Raid', 'Stealth Retirement Operation', 'Assassination'
	];

	const allContracts = [
		'Tracking', 'Bounty Hunter', 'Retirement'
	];

	var typeBO = 'BlackOps';
	var typeO = 'Operations';
	var typeC = 'Contracts';
	var typeGA = 'General';

	var trainigGA = 'Training';
	var fieldAnalisysGA = 'Field Analysis';
	var recruitGA = 'Recruitment';
	var diplomacyGA = 'Diplomacy';
	var regenGA = 'Hyperbolic Regeneration Chamber';
	var violenceGA = 'Incite Violence';

	var trackingC = 'Tracking';
	var bountyHuntC = 'Bounty Hunter';
	var retirementC = 'Retirement';

	var investigationO = 'Investigation';
	var undercoverO = 'Undercover Operation';
	var stingO = 'Sting Operation';
	var raidO = 'Raid';
	var stelthRetO = 'Stealth Retirement Operation';
	var assassinationO = 'Assassination';

	var currentAction = '';
	var nextAction = '';
	var currentProblem = '';
	var currentProblemSourceType = '';
	var currentActiveBO;
	var currentReqRank;
	var needPlan = true;
	var workingOnPlan = false;
	var timeToImpl = 0;
	var timeForStep = 0;

	//TODO fast start crime module;

	//User Defined Parameters start
	var currentCity = 'Sector-12'; //Current city from your Bladeburner interface (default = 'Sector-12')
	var boChance = 0.55; //default = 0.7
	var opChance = 0.55; //default = 0.7
	var cChance = 0.55; //default = 0.7
	var cityChaos = 3; //default = 3
	//User Defined Parameters end

	const chances = (t, n, c) => evalChances(t, n, c);

	function evalChances(t, n, c) {
		let chance = ns.bladeburner.getActionEstimatedSuccessChance(t, n);
		return ((chance[0] + chance[1]) / 2) >= c;
	}

	function stopCurrentAction() {
		ns.bladeburner.stopBladeburnerAction();
	}

	function startNewAction(type, name) {
		return ns.bladeburner.startAction(type, name);
	}

	function getCurrentRank() {
		return ns.bladeburner.getRank();
	}

	function checkCityChaos(city) {
		return ns.bladeburner.getCityChaos(city);
	}

	function checkCityCommunities(city) {
		return ns.bladeburner.getCityCommunities(city);
	}

	function checkCityPopulation(city) {
		return ns.bladeburner.getCityEstimatedPopulation(city);
	}

	function calculateTime(type, action) {
		return ns.bladeburner.getActionTime(type, action);
	}

	function calculateRankGain(type, action) {
		return ns.bladeburner.getActionRepGain(type, action, ns.bladeburner.getActionCurrentLevel(type, action));
	}

	function doTraining() {
		if (startNewAction(typeGA, trainigGA)) {
			currentAction = trainigGA;
			return calculateTime(typeGA, trainigGA);
		}
	}

	function doDiplomacy() {
		if (startNewAction(typeGA, diplomacyGA)) {
			currentAction = diplomacyGA;
			return calculateTime(typeGA, diplomacyGA);
		}
	}

	function doAnalysis() {
		if (startNewAction(typeGA, fieldAnalisysGA)) {
			currentAction = fieldAnalisysGA;
			return calculateTime(typeGA, fieldAnalisysGA);
		}
	}

	function doRecruit() {
		if (startNewAction(typeGA, recruitGA)) {
			currentAction = recruitGA;
			return calculateTime(typeGA, recruitGA);
		}
	}

	function doViolence() {
		if (startNewAction(typeGA, violenceGA)) {
			currentAction = violenceGA;
			return calculateTime(typeGA, violenceGA);
		}
	}

	function doRegen() {
		if (startNewAction(typeGA, regenGA)) {
			currentAction = regenGA;
			return calculateTime(typeGA, regenGA);
		}
	}

	function updateCityData() {
		let checkDate = new Date();
		let updatedCities = [];
		for (let cad of cities) {
			let cityData = [
				checkCityChaos(cad[0]),
				checkCityCommunities(cad[0]),
				checkCityPopulation(cad[0]),
				checkDate
			];
			updatedCities.push([cad[0], cityData]);
		}
		cities = updatedCities;
	}

	function findActiveBO() {
		for (let bO of allBO) {
			if (getCurrentRank() >= bO[1]) {
				if (startNewAction(typeBO, bO[0])) {
					currentActiveBO = bO[0];
					currentReqRank = bO[1];
					stopCurrentAction();
					break;
				} else {
					continue;
				}
			} else {
				currentActiveBO = bO[0];
				currentReqRank = bO[1];
				break;
			}

		}
	}

	function findBestAvailOp() {
		let availOps = [];
		for (let op of allOps) {
			if (ns.bladeburner.getActionCountRemaining(typeO, op) >= 1) {
				if (!op == raidO) {
					availOps.push(op);
				} else {
					if (checkCityCommunities(ns.bladeburner.getCity()) > 0) {
						availOps.push(op);
					} else {
						continue;
					}
				}
			}
		}
		if (availOps.length == 0) {
			return investigationO;
		} else {
			return availOps[availOps.length - 1];
		}

	}

	function findBestAvailContract() {
		let availContracts = [];
		for (let contacrt of allContracts) {
			if (ns.bladeburner.getActionCountRemaining(typeC, contacrt) >= 1) {
				if (contacrt == trackingC) {
					availContracts.push(contacrt);
				} else {
					if (checkCityPopulation(ns.bladeburner.getCity()) > 0) {
						availContracts.push(contacrt);
					} else {
						continue;
					}
				}
			}
		}
		if (availContracts.length == 0) {
			return trackingC;
		} else {
			return availContracts[availContracts.length - 1];
		}
	}

	function spendSkillPoints() {
		let flag = true;
		let countUnableToUpgrade = 0;
		while (flag) {
			for (let skill of prefSkills) {
				if (ns.bladeburner.upgradeSkill(skill)) {
					continue;
				} else {
					countUnableToUpgrade++;
					continue;
				}
			}
			if (countUnableToUpgrade == prefSkills.length) {
				flag = false;
			} else {
				countUnableToUpgrade = 0;
			}
		}
	}

	function generatePlan(problem, sourceType) {
		plan = [];
		planLog = [];
		switch (problem) {
			case ('rank'): {
				let action = findBestAvailOp();
				// let singleGain = calculateRankGain(typeO, action);
				plan.push([typeO, action, 10]);
				break;
			}

			case ('chance'): {
				//determine source of problem chaos -> teamSize -> trainig
				if (checkCityChaos(currentCity) >= cityChaos) {
					plan.push([typeGA, diplomacyGA, 10]);
				} else {
					if (sourceType == typeBO) {
						let action = findBestAvailOp();
						plan.push([typeO, action, 10]);
					}
					if (sourceType == typeO) {
						let action = findBestAvailContract();
						plan.push([typeC, action, 10]);
					}
					if (sourceType == typeC) {
						plan.push([typeGA, trainigGA, 10]);
					}
				}
				break;
			}

			case ('noAvailNonGAction'): {
				plan.push([typeGA, violenceGA, 1]);
				break;
			}

			case ('chaos'): {
				plan.push([typeGA, diplomacyGA, 10]);
				break;
			}

			default: {
				plan.push([typeBO, currentActiveBO, 1]);
				let action = findBestAvailOp();
				plan.push([typeO, action, 10]);
			}
		}
		planLog = plan.map((x) => x);
		clearCurrentProblem();
	}

	function clearCurrentProblem() {
		currentProblem = '';
		currentProblemSourceType = '';
	}

	function implementPlan() {
		spendSkillPoints();
		if (plan.length == 0) {
			timeToImpl = 0;
			timeForStep = 0;
		} else {
			timeForStep = calculateTime(plan[0][0], plan[0][1]);
			switch (plan[0][0]) {
				case (typeBO): {
					findActiveBO();
					doBO();
					break;
				}
				case (typeO): {
					doOps(plan[0][1]);
					break;
				}
				case (typeC): {
					doContracts(plan[0][1]);
					break;
				}
				case (typeGA): {
					ns.bladeburner.startAction(plan[0][0], plan[0][1]);
					break;
				}
				default: {
					ns.print('Unknown action');
				}
			}

			if (plan[0][2] == 1) {
				plan.shift();
			} else {
				plan[0][2]--;
			}
		}
	}

	function calculatePlanImplTime() {
		timeToImpl = 0;
		for (let step of plan) {
			timeToImpl += calculateTime(step[0], step[1]) * step[2];
		}
	}

	function doBO() {
		if (chances(typeBO, currentActiveBO, boChance)) {
			if (!ns.bladeburner.startAction(typeBO, currentActiveBO)) {
				ns.print(`Unable to start action ${currentActiveBO} of type ${typeBO} reason low rank`);
				currentProblem = 'rank';
				currentProblemSourceType = typeBO;
				timeToImpl = 0;
				timeForStep = 0;
			} else {
				ns.print(`Started action ${currentActiveBO} of type ${typeBO}`);
			}
		} else {
			ns.print(`Unable to start action ${currentActiveBO} of type ${typeBO} reason low chance`);
			currentProblem = 'chance';
			currentProblemSourceType = typeBO;
			timeToImpl = 0;
			timeForStep = 0;
		}
	}

	function doOps(availOp) {
		if (chances(typeO, availOp, opChance)) {
			if (!ns.bladeburner.startAction(typeO, availOp)) {
				ns.print(`Unable to start action ${availOp} of type ${typeO} reason low action count`);
				currentProblem = 'noAvailNonGAction';
				currentProblemSourceType = typeO;
				timeToImpl = 0;
				timeForStep = 0;
			} else {
				ns.print(`Started action ${availOp} of type ${typeO}`);
			}
		} else {
			ns.print(`Unable to start action ${availOp} of type ${typeO} reason low chance`);
			currentProblem = 'chance';
			currentProblemSourceType = typeO;
			timeToImpl = 0;
			timeForStep = 0;
		}
	}

	function doContracts(availContract) {
		if (chances(typeC, availContract, cChance)) {
			if (!ns.bladeburner.startAction(typeC, availContract)) {
				ns.print(`Unable to start action ${availContract} of type ${typeC} reason low action count`);
				currentProblem = 'noAvailNonGAction';
				currentProblemSourceType = typeC;
				timeToImpl = 0;
				timeForStep = 0;
			} else {
				ns.print(`Started action ${availContract} of type ${typeC}`);
			}
		} else {
			ns.print(`Unable to start action ${availContract} of type ${typeC} reason low chance`);
			currentProblem = 'chance';
			currentProblemSourceType = typeC;
			timeToImpl = 0;
			timeForStep = 0;
		}
	}


	function log() {
		if (cycle[0] >= 4) {
			cycle[0] = 0
		}
		cycle[0]++;
		ns.clearLog();
		ns.print('╔═══╦══════════════════════════╦════════╗');
		ns.print(`║ ${cycle[cycle[0]]} ║ PLANED ACTION            ║ CYCLES ║`);
		let i = 1;
		for (let step of planLog) {
			ns.print('╠═══║══════════════════════════║════════║');
			ns.print(`║ ${i} ║ ${step[1]} of type ${step[0]} ║ ${step[2]} ║`);
			i++;
		}
		ns.print('╠═══╩══════════════════════════╩════════╝')
	}

	ns.tail();
	updateCityData();
	stopCurrentAction();

	while (true) {
		if (timeToImpl <= 0) {
			needPlan = true;
		}
		if (needPlan) {
			generatePlan(currentProblem, currentProblemSourceType);
			calculatePlanImplTime();
			needPlan = false;
		}
		// log();
		if (timeForStep <= 0) {
			workingOnPlan = false;
		}
		if (!workingOnPlan) {
			implementPlan();
			workingOnPlan = true;
		}
		timeToImpl -= 1000;
		timeForStep -= 1000;
		await ns.asleep(1000);
	}
}
