if( !('Dg' in window ) ) { Dg = {}; }
if( !Dg.OccupationSkill ) { Dg.OccupationSkill= {}; }
if( !Dg.BaseSkillValues ) { Dg.BaseSkillValues= {}; }
if( !Dg.SkillPackages ) { Dg.SkillPackages= {}; }
if( !Dg.OccupationSkills ) { Dg.OccupationSkills= {}; }

Dg.OccupationSkill = function() {
  this.occupation = {}
  this.skillPackage = []
  this.chosenOptions = []
  this.packageOptions = {}
}

Dg.OccupationSkill.prototype = {
  setOccupation: function(occupationId) {
    this.occupation = Dg.OccupationSkills[occupationId] || {}
    this.chosenOptions = []
  },

  setSkillPackage: function(skillPackageName) {
    this.skillPackage = Dg.SkillPackages[skillPackageName] || []
    this.packageOptions = {}
  },

  selectOption: function(option) {
    if(event.target.checked) {
      this.chosenOptions.push(option)
      if(this.chosenOptions.length > this.occupation.choose) {
        const unselected = this.chosenOptions.shift()
        $(`#option-${unselected}`).prop('checked', false)
      }
    } else {
      this.chosenOptions = _.without(this.chosenOptions, option)
    }
  },

  selectPackageOption(i, option) {
    this.packageOptions[i] = option
  },

  getValues: function() {
    const baseSkills = _.reduce(Dg.BaseSkillValues, (mem, percentage, id) => {
      mem[id] = { additions: [], value: percentage }
      return mem
    }, {})

    $(this.occupation.skills).each( (i, skill) => {
      baseSkills[skill.id].additions.push(skill.percentage)
      if(skill.id.match(/_\d/)) {
        baseSkills[skill.id].type = skill.type
      }
    })

    $(this.chosenOptions).each( (i, id) => {
      const chosenOption = _.find(this.occupation.options, (o) => o.id == id)
      baseSkills[chosenOption.id].additions.push(chosenOption.percentage)
      if(chosenOption.id.match(/_\d/)) {
        baseSkills[chosenOption.id].type = chosenOption.type
      }
    })

    $(_.map(this.skillPackage, (sp) => sp.id).concat(_.values(this.packageOptions))).each( (index, skill) => {
      if(baseSkills[`${skill}_1`]) {
        const level = _.min([1,2,3], (i) => {
          return baseSkills[`${skill}_${i}`].additions.length
        })
        baseSkills[`${skill}_${level}`].additions.push(20)
      } else if(baseSkills[skill]) {
        baseSkills[skill].additions.push(20)
      } else {
        console.log("Found: " + skill)
      }
    })

    return {
      skills: baseSkills,
      occupation: this.occupation,
      skillPackage: this.skillPackage,
      chosenOptions: this.chosenOptions,
      packageOptions: this.packageOptions
    }
  }
}

Dg.BaseSkillValues = { "accounting": 10, "alertness": 20, "anthropology": 0, "archeology": 0, "art_1": 0, "art_2": 0, "art_3": 0, "artillery": 0, "athletics": 30, "bureaucracy": 10, "computer_science": 0, "craft_1": 0, "craft_2": 0, "craft_3": 0, "criminology": 10, "demolitions": 0, "disguise": 10, "dodge": 30, "drive": 20, "firearms": 20, "first_aid": 10, "forensics": 0, "humint": 10, "heavy_machinery": 10, "heavy_weapons": 0, "history": 10, "law": 0, "medicine": 0, "melee_weapons": 30, "military_science_1": 0, "military_science_2": 0, "military_science_3": 0, "navigate": 10, "occult": 10, "persuade": 20, "pharmacy": 0, "pilot_1": 0, "pilot_2": 0, "pilot_3": 0, "psychotherapy": 10, "ride": 10, "sigint": 0, "science_1": 0, "science_2": 0, "science_3": 0, "search": 20, "stealth": 10, "surgery": 0, "survival": 10, "swim": 20, "unarmed_combat": 40, "unnatural": 0, "foreign_language_1": 0, "foreign_language_2": 0, "foreign_language_3": 0 }

Dg.SkillPackages = {"Artist, actor, or musician":[{"skill":"Alertness","id":"alertness"},{"skill":"Craft","id":"craft"},{"skill":"Disguise","id":"disguise"},{"skill":"Persuade","id":"persuade"},{"skill":"Art","id":"art"},{"skill":"Art","id":"art"},{"skill":"Art","id":"art"},{"skill":"Humint","id":"humint"}],"Athlete":[{"skill":"Alertness","id":"alertness"},{"skill":"Athletics","id":"athletics"},{"skill":"Dodge","id":"dodge"},{"skill":"First Aid","id":"first_aid"},{"skill":"Humint","id":"humint"},{"skill":"Persuade","id":"persuade"},{"skill":"Swim","id":"swim"},{"skill":"Unarmed Combat","id":"unarmed_combat"}],"Author, editor, or journalist":[{"skill":"Anthropology","id":"anthropology"},{"skill":"Art","id":"art"},{"skill":"Bureaucracy","id":"bureaucracy"},{"skill":"History","id":"history"},{"skill":"Law","id":"law"},{"skill":"Occult","id":"occult"},{"skill":"Persuade","id":"persuade"},{"skill":"Humint","id":"humint"}],"“black bag” training":[{"skill":"Alertness","id":"alertness"},{"skill":"Athletics","id":"athletics"},{"skill":"Craft","id":"craft"},{"skill":"Craft","id":"craft"},{"skill":"Criminology","id":"criminology"},{"skill":"Disguise","id":"disguise"},{"skill":"Search","id":"search"},{"skill":"Stealth","id":"stealth"}],"Blue-collar worker":[{"skill":"Alertness","id":"alertness"},{"skill":"Craft","id":"craft"},{"skill":"Craft","id":"craft"},{"skill":"Drive","id":"drive"},{"skill":"First Aid","id":"first_aid"},{"skill":"Heavy Machinery","id":"heavy_machinery"},{"skill":"Navigate","id":"navigate"},{"skill":"Search","id":"search"}],"Bureaucrat":[{"skill":"Accounting","id":"accounting"},{"skill":"Bureaucracy","id":"bureaucracy"},{"skill":"Computer Science","id":"computer_science"},{"skill":"Criminology","id":"criminology"},{"skill":"Humint","id":"humint"},{"skill":"Law","id":"law"},{"skill":"Persuade","id":"persuade"},{"skill":"+1","id":"1"}],"Clergy":[{"skill":"Foreign Language","id":"foreign_language"},{"skill":"Foreign Language","id":"foreign_language"},{"skill":"Foreign Language","id":"foreign_language"},{"skill":"History","id":"history"},{"skill":"Humint","id":"humint"},{"skill":"Occult","id":"occult"},{"skill":"Persuade","id":"persuade"},{"skill":"Psychotherapy","id":"psychotherapy"}],"Combat veteran":[{"skill":"Alertness","id":"alertness"},{"skill":"Dodge","id":"dodge"},{"skill":"Firearms","id":"firearms"},{"skill":"First Aid","id":"first_aid"},{"skill":"Heavy Weapons","id":"heavy_weapons"},{"skill":"Melee Weapons","id":"melee_weapons"},{"skill":"Stealth","id":"stealth"},{"skill":"Unarmed Combat","id":"unarmed_combat"}],"Computer enthusiast or hacker":[{"skill":"Computer Science","id":"computer_science"},{"skill":"Craft","id":"craft"},{"skill":"Science","id":"science"},{"skill":"Sigint","id":"sigint"},{"skill":"+4","id":"4"}],"Counselor":[{"skill":"Bureaucracy","id":"bureaucracy"},{"skill":"First Aid","id":"first_aid"},{"skill":"Foreign Language","id":"foreign_language"},{"skill":"Humint","id":"humint"},{"skill":"Law","id":"law"},{"skill":"Persuade","id":"persuade"},{"skill":"Psychotherapy","id":"psychotherapy"},{"skill":"Search","id":"search"}],"Criminalist":[{"skill":"Accounting","id":"accounting"},{"skill":"Bureaucracy","id":"bureaucracy"},{"skill":"Computer Science","id":"computer_science"},{"skill":"Criminology","id":"criminology"},{"skill":"Forensics","id":"forensics"},{"skill":"Law","id":"law"},{"skill":"Pharmacy","id":"pharmacy"},{"skill":"Search","id":"search"}],"Firefighter":[{"skill":"Alertness","id":"alertness"},{"skill":"Demolitions","id":"demolitions"},{"skill":"Drive","id":"drive"},{"skill":"First Aid","id":"first_aid"},{"skill":"Forensics","id":"forensics"},{"skill":"Heavy Machinery","id":"heavy_machinery"},{"skill":"Navigate","id":"navigate"},{"skill":"Search","id":"search"}],"Gangster or deep cover":[{"skill":"Alertness","id":"alertness"},{"skill":"Criminology","id":"criminology"},{"skill":"Dodge","id":"dodge"},{"skill":"Drive","id":"drive"},{"skill":"Persuade","id":"persuade"},{"skill":"Stealth","id":"stealth"},{"skill":"+2","id":"2"}],"Interrogator":[{"skill":"Criminology","id":"criminology"},{"skill":"Foreign Language","id":"foreign_language"},{"skill":"Foreign Language","id":"foreign_language"},{"skill":"Humint","id":"humint"},{"skill":"Law","id":"law"},{"skill":"Persuade","id":"persuade"},{"skill":"Pharmacy","id":"pharmacy"},{"skill":"Search","id":"search"}],"Liberal arts degree":[{"skill":"Anthropology","id":"anthropology"},{"skill":"Art","id":"art"},{"skill":"Foreign Language","id":"foreign_language"},{"skill":"History","id":"history"},{"skill":"Persuade","id":"persuade"},{"skill":"+3","id":"3"}],"Military officer":[{"skill":"Bureaucracy","id":"bureaucracy"},{"skill":"Firearms","id":"firearms"},{"skill":"History","id":"history"},{"skill":"Military Science","id":"military_science"},{"skill":"Navigate","id":"navigate"},{"skill":"Persuade","id":"persuade"},{"skill":"Unarmed Combat","id":"unarmed_combat"},{"skill":"+1","id":"1"}],"Mba":[{"skill":"Accounting","id":"accounting"},{"skill":"Bureaucracy","id":"bureaucracy"},{"skill":"Humint","id":"humint"},{"skill":"Law","id":"law"},{"skill":"Persuade","id":"persuade"},{"skill":"+3","id":"3"}],"Nurse, paramedic, or pre-med":[{"skill":"Alertness","id":"alertness"},{"skill":"First Aid","id":"first_aid"},{"skill":"Medicine","id":"medicine"},{"skill":"Persuade","id":"persuade"},{"skill":"Pharmacy","id":"pharmacy"},{"skill":"Psychotherapy","id":"psychotherapy"},{"skill":"Science","id":"science"},{"skill":"Search","id":"search"}],"Occult investigator or conspiracy theorist":[{"skill":"Anthropology","id":"anthropology"},{"skill":"Archeology","id":"archeology"},{"skill":"Computer Science","id":"computer_science"},{"skill":"Criminology","id":"criminology"},{"skill":"History","id":"history"},{"skill":"Occult","id":"occult"},{"skill":"Persuade","id":"persuade"},{"skill":"Search","id":"search"}],"Outdoorsman":[{"skill":"Alertness","id":"alertness"},{"skill":"Athletics","id":"athletics"},{"skill":"Firearms","id":"firearms"},{"skill":"Navigate","id":"navigate"},{"skill":"Ride","id":"ride"},{"skill":"Search","id":"search"},{"skill":"Stealth","id":"stealth"},{"skill":"Survival","id":"survival"}],"Photographer":[{"skill":"Alertness","id":"alertness"},{"skill":"Art","id":"art"},{"skill":"Computer Science","id":"computer_science"},{"skill":"Persuade","id":"persuade"},{"skill":"Search","id":"search"},{"skill":"Stealth","id":"stealth"},{"skill":"+2","id":"2"}],"Pilot or sailor":[{"skill":"Alertness","id":"alertness"},{"skill":"Craft","id":"craft"},{"skill":"First Aid","id":"first_aid"},{"skill":"Foreign Language","id":"foreign_language"},{"skill":"Navigate","id":"navigate"},{"skill":"Pilot","id":"pilot"},{"skill":"Survival","id":"survival"},{"skill":"Swim","id":"swim"}],"Police officer":[{"skill":"Alertness","id":"alertness"},{"skill":"Criminology","id":"criminology"},{"skill":"Drive","id":"drive"},{"skill":"Firearms","id":"firearms"},{"skill":"Humint","id":"humint"},{"skill":"Law","id":"law"},{"skill":"Melee Weapons","id":"melee_weapons"},{"skill":"Unarmed Combat","id":"unarmed_combat"}],"Science grad student":[{"skill":"Bureaucracy","id":"bureaucracy"},{"skill":"Computer Use","id":"computer_use"},{"skill":"Craft","id":"craft"},{"skill":"Foreign Language","id":"foreign_language"},{"skill":"Science","id":"science"},{"skill":"Science","id":"science"},{"skill":"Science","id":"science"},{"skill":"+1","id":"1"}],"Social worker or criminal justice degree":[{"skill":"Bureaucracy","id":"bureaucracy"},{"skill":"Criminology","id":"criminology"},{"skill":"Forensics","id":"forensics"},{"skill":"Foreign Language","id":"foreign_language"},{"skill":"Humint","id":"humint"},{"skill":"Law","id":"law"},{"skill":"Persuade","id":"persuade"},{"skill":"Search","id":"search"}],"Soldier or marine":[{"skill":"Alertness","id":"alertness"},{"skill":"Artillery","id":"artillery"},{"skill":"Athletics","id":"athletics"},{"skill":"Drive","id":"drive"},{"skill":"Firearms","id":"firearms"},{"skill":"Heavy Weapons","id":"heavy_weapons"},{"skill":"Military Science","id":"military_science"},{"skill":"Unarmed Combat","id":"unarmed_combat"}],"Translator":[{"skill":"Anthropology","id":"anthropology"},{"skill":"Foreign Language","id":"foreign_language"},{"skill":"Foreign Language","id":"foreign_language"},{"skill":"Foreign Language","id":"foreign_language"},{"skill":"History","id":"history"},{"skill":"Humint","id":"humint"},{"skill":"Persuade","id":"persuade"},{"skill":"+1","id":"1"}],"Urban explorer":[{"skill":"Alertness","id":"alertness"},{"skill":"Athletics","id":"athletics"},{"skill":"Craft","id":"craft"},{"skill":"Law","id":"law"},{"skill":"Navigate","id":"navigate"},{"skill":"Persuade","id":"persuade"},{"skill":"Search","id":"search"},{"skill":"Stealth","id":"stealth"}]}

Dg.OccupationSkills = {"anthropologist":{"id":"anthropologist","name":"Anthropologist","skills":[{"id":"anthropology","skill":"Anthropology","percentage":50},{"id":"bureaucracy","skill":"Bureaucracy","percentage":40},{"id":"foreign_language_1","skill":"Foreign Language","percentage":50,"type":""},{"id":"foreign_language_2","skill":"Foreign Language","percentage":40,"type":""},{"id":"history","skill":"History","percentage":60},{"id":"occult","skill":"Occult","percentage":40},{"id":"persuade","skill":"Persuade","percentage":40}],"options":[{"id":"anthropology","skill":"Anthropology","percentage":40},{"id":"archeology","skill":"Archeology","percentage":40},{"id":"humint","skill":"HUMINT","percentage":50},{"id":"navigate","skill":"Navigate","percentage":50},{"id":"ride","skill":"Ride","percentage":50},{"id":"search","skill":"Search","percentage":60},{"id":"survival","skill":"Survival","percentage":50}],"description":"You study humanity. You’re concerned with the patterns that emerge over time, across land masses, cultures, and language groups. You might be a number-cruncher, a field worker trudging through the jungle, a consultant in a war zone, or a think-tank analyst sifting myth from history in studies of the Tcho-Tcho peoples.","recommended_stats":"INT","choose":2,"bonds":4},"computer_engineer":{"id":"computer_engineer","name":"Computer Engineer","skills":[{"id":"computer_science","skill":"Computer Science","percentage":60},{"id":"craft_1","skill":"Craft","percentage":30,"type":"Electrician"},{"id":"craft_2","skill":"Craft","percentage":30,"type":"Mechanic"},{"id":"craft_3","skill":"Craft","percentage":40,"type":"Microelectronics"},{"id":"science_1","skill":"Science","percentage":40,"type":"Mathematics"},{"id":"sigint","skill":"SIGINT","percentage":40}],"options":[{"id":"accounting","skill":"Accounting","percentage":50},{"id":"bureaucracy","skill":"Bureaucracy","percentage":50},{"id":"foreign_language_1","skill":"Foreign Language","percentage":40,"type":""},{"id":"heavy_machinery","skill":"Heavy Machinery","percentage":50},{"id":"law","skill":"Law","percentage":40},{"id":"science_2","skill":"Science","percentage":40,"type":""}],"description":"Computers and machinery are the backbone of modern industry. You are a craftsman with data or machinery, possibly for the government and most definitely for profit. However you use your skills, the overlap between information technology and awareness of the unnatural could make this the most dangerous job on the planet.","recommended_stats":"INT","choose":4,"bonds":3},"criminal":{"id":"criminal","name":"Criminal","skills":[{"id":"alertness","skill":"Alertness","percentage":50},{"id":"criminology","skill":"Criminology","percentage":60},{"id":"dodge","skill":"Dodge","percentage":40},{"id":"drive","skill":"Drive","percentage":50},{"id":"firearms","skill":"Firearms","percentage":40},{"id":"law","skill":"Law","percentage":40},{"id":"melee_weapons","skill":"Melee Weapons","percentage":40},{"id":"persuade","skill":"Persuade","percentage":50},{"id":"stealth","skill":"Stealth","percentage":50},{"id":"unarmed_combat","skill":"Unarmed Combat","percentage":50}],"options":[{"id":"craft_1","skill":"Craft","percentage":40,"type":"Locksmithing"},{"id":"demolitions","skill":"Demolitions","percentage":40},{"id":"disguise","skill":"Disguise","percentage":50},{"id":"foreign_language_1","skill":"Foreign Language","percentage":40,"type":""},{"id":"forensics","skill":"Forensics","percentage":40},{"id":"humint","skill":"HUMINT","percentage":50},{"id":"navigate","skill":"Navigate","percentage":50},{"id":"occult","skill":"Occult","percentage":50},{"id":"pharmacy","skill":"Pharmacy","percentage":40}],"description":"So much is illegal that there are broad economies of crime. This profile fits a hardened militant or a traditional “black collar” criminal: pimp, burglar, extortionist, or thug. If you want a white-collar criminal, choose Computer Scientist or Business Executive and make very risky decisions.","recommended_stats":"STR, DEX","choose":2,"bonds":4},"federal_agent":{"id":"federal_agent","name":"Federal Agent","skills":[{"id":"alertness","skill":"Alertness","percentage":50},{"id":"bureaucracy","skill":"Bureaucracy","percentage":40},{"id":"criminology","skill":"Criminology","percentage":50},{"id":"drive","skill":"Drive","percentage":50},{"id":"firearms","skill":"Firearms","percentage":50},{"id":"forensics","skill":"Forensics","percentage":30},{"id":"humint","skill":"HUMINT","percentage":60},{"id":"law","skill":"Law","percentage":30},{"id":"persuade","skill":"Persuade","percentage":50},{"id":"search","skill":"Search","percentage":50},{"id":"unarmed_combat","skill":"Unarmed Combat","percentage":60}],"options":[{"id":"accounting","skill":"Accounting","percentage":60},{"id":"computer_science","skill":"Computer Science","percentage":50},{"id":"foreign_language_1","skill":"Foreign Language","percentage":50,"type":""},{"id":"heavy_weapons","skill":"Heavy Weapons","percentage":50},{"id":"pharmacy","skill":"Pharmacy","percentage":50}],"description":"Many Delta Green Agents are federal law enforcement officers, mostly from the FBI. Delta Green decided long ago that federal agents have the optimum balance of skills and mental stability needed to confront the unnatural.","recommended_stats":"CON, POW, CHA","choose":1,"bonds":3},"firefighter":{"id":"firefighter","name":"Firefighter","skills":[{"id":"alertness","skill":"Alertness","percentage":50},{"id":"athletics","skill":"Athletics","percentage":60},{"id":"craft_1","skill":"Craft","percentage":40,"type":"Electrician"},{"id":"craft_2","skill":"Craft","percentage":40,"type":"Mechanic"},{"id":"demolitions","skill":"Demolitions","percentage":50},{"id":"drive","skill":"Drive","percentage":50},{"id":"first_aid","skill":"First Aid","percentage":50},{"id":"forensics","skill":"Forensics","percentage":40},{"id":"heavy_machinery","skill":"Heavy Machinery","percentage":50},{"id":"navigate","skill":"Navigate","percentage":50},{"id":"search","skill":"Search","percentage":40}],"options":[],"description":"Your job oscillates between the tedium of maintaining your gear, exhilaration when the alarm finally comes, and the work of investigating a scene after the smoke has cleared. If you’re involved with Delta Green, you clearly stumbled into something worse than a house fire.","recommended_stats":"STR, DEX, CON","bonds":3},"foreign_service_officer":{"id":"foreign_service_officer","name":"Foreign Service Officer","skills":[{"id":"try_to_get_along_with_them_odds_are_you_work_for_the_state_department_though_usaid_the_commercial_service_and_the_foreign_agriculture_service_also_have_fsos_either_way_you_ve_had_every_opportunity_to_learn_exotic_and_deadly_things_the_kinds_of_things_that_qualify_you_for_delta_green","skill":"try to get along with them. Odds are you work for the State Department, though USAID, the Commercial Service and the Foreign Agriculture Service also have FSOs. Either way, you’ve had every opportunity to learn exotic and deadly things; the kinds of things that qualify you for Delta Green","percentage":0},{"id":"accounting","skill":"Accounting","percentage":40},{"id":"anthropology","skill":"Anthropology","percentage":40},{"id":"bureaucracy","skill":"Bureaucracy","percentage":60},{"id":"foreign_language_1","skill":"Foreign Language","percentage":50,"type":""},{"id":"foreign_language_2","skill":"Foreign Language","percentage":50,"type":""},{"id":"foreign_language_3","skill":"Foreign Language","percentage":40,"type":""},{"id":"history","skill":"History","percentage":40},{"id":"humint","skill":"HUMINT","percentage":50},{"id":"law","skill":"Law","percentage":40},{"id":"persuade","skill":"Persuade","percentage":50}],"options":[],"description":"You travel to strange lands, meet interesting people, and","recommended_stats":"INT, CHA","bonds":3},"historian":{"id":"historian","name":"Historian","skills":[{"id":"archeology","skill":"Archeology","percentage":50},{"id":"bureaucracy","skill":"Bureaucracy","percentage":40},{"id":"foreign_language_1","skill":"Foreign Language","percentage":50,"type":""},{"id":"foreign_language_2","skill":"Foreign Language","percentage":40,"type":""},{"id":"history","skill":"History","percentage":60},{"id":"occult","skill":"Occult","percentage":40},{"id":"persuade","skill":"Persuade","percentage":40}],"options":[{"id":"anthropology","skill":"Anthropology","percentage":40},{"id":"archeology","skill":"Archeology","percentage":40},{"id":"humint","skill":"HUMINT","percentage":50},{"id":"navigate","skill":"Navigate","percentage":50},{"id":"ride","skill":"Ride","percentage":50},{"id":"search","skill":"Search","percentage":60},{"id":"survival","skill":"Survival","percentage":50}],"description":"You study humanity. You’re concerned with the patterns that emerge over time, across land masses, cultures, and language groups. You might be a number-cruncher, a field worker trudging through the jungle, a consultant in a war zone, or a think-tank analyst sifting myth from history in studies of the Tcho-Tcho peoples.","recommended_stats":"INT","choose":2,"bonds":4},"intelligence_analyst":{"id":"intelligence_analyst","name":"Intelligence Analyst","skills":[{"id":"anthropology","skill":"Anthropology","percentage":40},{"id":"bureaucracy","skill":"Bureaucracy","percentage":50},{"id":"computer_science","skill":"Computer Science","percentage":40},{"id":"criminology","skill":"Criminology","percentage":40},{"id":"foreign_language_1","skill":"Foreign Language","percentage":50,"type":""},{"id":"foreign_language_2","skill":"Foreign Language","percentage":50,"type":""},{"id":"foreign_language_3","skill":"Foreign Language","percentage":40,"type":""},{"id":"history","skill":"History","percentage":40},{"id":"humint","skill":"HUMINT","percentage":50},{"id":"sigint","skill":"SIGINT","percentage":40}],"options":[],"description":"In the FBI, NSA and CIA, there are those who gather information and those who decide what it means. You take information from disparate sources—newspapers, websites, informants, ELINT, and the assets developed by Case Officers—and figure out what it means. In short, your job is the piecing together of unrelated knowledge, a dangerous endeavor in the world of Delta Green.","recommended_stats":"INT","bonds":3},"intelligence_case_officer":{"id":"intelligence_case_officer","name":"Intelligence Case Officer","skills":[{"id":"alertness","skill":"Alertness","percentage":50},{"id":"bureaucracy","skill":"Bureaucracy","percentage":40},{"id":"criminology","skill":"Criminology","percentage":50},{"id":"disguise","skill":"Disguise","percentage":50},{"id":"drive","skill":"Drive","percentage":40},{"id":"firearms","skill":"Firearms","percentage":40},{"id":"foreign_language_1","skill":"Foreign Language","percentage":50,"type":""},{"id":"foreign_language_2","skill":"Foreign Language","percentage":40,"type":""},{"id":"humint","skill":"HUMINT","percentage":60},{"id":"persuade","skill":"Persuade","percentage":60},{"id":"sigint","skill":"SIGINT","percentage":40},{"id":"stealth","skill":"Stealth","percentage":50},{"id":"unarmed_combat","skill":"Unarmed Combat","percentage":50}],"options":[],"description":"You recruit people to spy on their own countries for your agency, probably the CIA. Your job is to develop foreign intelligence sources (‘assets’), communicate with them, and keep them under control, productive, and alive. It’s a hard business because you must view everyone as a potential threat, liar, or tool to further your agenda. If your name came to the attention of Delta Green, congratulations; you are now someone else’s asset.","recommended_stats":"INT, POW, CHA","bonds":2},"lawyer_or_business_executive":{"id":"lawyer_or_business_executive","name":"Lawyer or Business Executive","skills":[{"id":"accounting","skill":"Accounting","percentage":50},{"id":"bureaucracy","skill":"Bureaucracy","percentage":50},{"id":"humint","skill":"HUMINT","percentage":40}],"options":[{"id":"computer_science","skill":"Computer Science","percentage":50},{"id":"criminology","skill":"Criminology","percentage":60},{"id":"foreign_language_1","skill":"Foreign Language","percentage":50,"type":""},{"id":"law","skill":"Law","percentage":50},{"id":"pharmacy","skill":"Pharmacy","percentage":50},{"id":"persuade","skill":"Persuade","percentage":60}],"description":"Your tools are a computer and smartphone. You might be moving millions of dollars, or bits of data, or both. Or you might be a prosecutor, a defense attorney, or judge.","recommended_stats":"INT, CHA","choose":4,"bonds":4},"media_specialist":{"id":"media_specialist","name":"Media Specialist","skills":[{"id":"art_1","skill":"Art","percentage":60,"type":""},{"id":"history","skill":"History","percentage":40},{"id":"humint","skill":"HUMINT","percentage":40}],"options":[{"id":"anthropology","skill":"Anthropology","percentage":40},{"id":"archeology","skill":"Archeology","percentage":40},{"id":"art_2","skill":"Art","percentage":40,"type":""},{"id":"bureaucracy","skill":"Bureaucracy","percentage":50},{"id":"computer_science","skill":"Computer Science","percentage":40},{"id":"criminology","skill":"Criminology","percentage":50},{"id":"foreign_language_1","skill":"Foreign Language","percentage":40,"type":""},{"id":"law","skill":"Law","percentage":40},{"id":"military_science_1","skill":"Military Science","percentage":40,"type":""},{"id":"occult","skill":"Occult","percentage":50},{"id":"science_1","skill":"Science","percentage":40,"type":""},{"id":"persuade","skill":"Persuade","percentage":50}],"description":"You might be an author, an editor, a researcher for a company or any branch of the government, a blogger, a TV reporter, or a scholar of rare texts. With the unnatural, you’ve uncovered the story of a lifetime.","recommended_stats":"INT, CHA","choose":5,"bonds":4},"nurse_or_paramedic":{"id":"nurse_or_paramedic","name":"Nurse or Paramedic","skills":[{"id":"alertness","skill":"Alertness","percentage":40},{"id":"bureaucracy","skill":"Bureaucracy","percentage":40},{"id":"first_aid","skill":"First Aid","percentage":60},{"id":"humint","skill":"HUMINT","percentage":40},{"id":"medicine","skill":"Medicine","percentage":40},{"id":"persuade","skill":"Persuade","percentage":40},{"id":"pharmacy","skill":"Pharmacy","percentage":40},{"id":"science_1","skill":"Science","percentage":40,"type":"Biology"}],"options":[{"id":"drive","skill":"Drive","percentage":60},{"id":"forensics","skill":"Forensics","percentage":40},{"id":"navigate","skill":"Navigate","percentage":50},{"id":"psychotherapy","skill":"Psychotherapy","percentage":50},{"id":"search","skill":"Search","percentage":60}],"description":"Medical professionals are on the front line when awful things happen. Is that what brought you to the group’s attention?","recommended_stats":"INT, POW, CHA","choose":2,"bonds":4},"physician":{"id":"physician","name":"Physician","skills":[{"id":"bureaucracy","skill":"Bureaucracy","percentage":50},{"id":"first_aid","skill":"First Aid","percentage":60},{"id":"medicine","skill":"Medicine","percentage":60},{"id":"persuade","skill":"Persuade","percentage":40},{"id":"pharmacy","skill":"Pharmacy","percentage":50},{"id":"science_1","skill":"Science","percentage":60,"type":"Biology"},{"id":"search","skill":"Search","percentage":40}],"options":[{"id":"forensics","skill":"Forensics","percentage":50},{"id":"psychotherapy","skill":"Psychotherapy","percentage":60},{"id":"science_2","skill":"Science","percentage":50,"type":""},{"id":"surgery","skill":"Surgery","percentage":50}],"description":"Doctors are often the first to uncover signs of an unnatural incursion, and the most valuable investigators of its disastrous effects on humanity.","recommended_stats":"INT, POW, DEX","choose":2,"bonds":3},"pilot_or_sailor":{"id":"pilot_or_sailor","name":"Pilot or Sailor","skills":[{"id":"alertness","skill":"Alertness","percentage":60},{"id":"bureaucracy","skill":"Bureaucracy","percentage":30},{"id":"craft_1","skill":"Craft","percentage":40,"type":"Electrician"},{"id":"craft_2","skill":"Craft","percentage":40,"type":"Mechanic"},{"id":"navigate","skill":"Navigate","percentage":50},{"id":"pilot_1","skill":"Pilot","percentage":60,"type":""},{"id":"science_1","skill":"Science","percentage":40,"type":"Meteorology"},{"id":"swim","skill":"Swim","percentage":40}],"options":[{"id":"foreign_language_1","skill":"Foreign Language","percentage":50,"type":""},{"id":"pilot_2","skill":"Pilot","percentage":50,"type":""},{"id":"heavy_weapons","skill":"Heavy Weapons","percentage":50},{"id":"military_science_1","skill":"Military Science","percentage":50,"type":""}],"description":"Air or sea, commercial or military, your duty is to keep your passengers alive and craft intact. This can lead to hard choices when your passengers put the vehicle in danger. Or are you a drone operator, flying a Predator from a thousand miles away? Either way, what op brought you to the attention of Delta Green?","recommended_stats":"DEX, INT","choose":2,"bonds":3},"police_officer":{"id":"police_officer","name":"Police Officer","skills":[{"id":"alertness","skill":"Alertness","percentage":60},{"id":"bureaucracy","skill":"Bureaucracy","percentage":40},{"id":"criminology","skill":"Criminology","percentage":40},{"id":"drive","skill":"Drive","percentage":50},{"id":"firearms","skill":"Firearms","percentage":40},{"id":"first_aid","skill":"First Aid","percentage":30},{"id":"humint","skill":"HUMINT","percentage":50},{"id":"law","skill":"Law","percentage":30},{"id":"melee_weapons","skill":"Melee Weapons","percentage":50},{"id":"navigate","skill":"Navigate","percentage":40},{"id":"persuade","skill":"Persuade","percentage":40},{"id":"search","skill":"Search","percentage":40},{"id":"unarmed_combat","skill":"Unarmed Combat","percentage":60}],"options":[{"id":"forensics","skill":"Forensics","percentage":50},{"id":"heavy_machinery","skill":"Heavy Machinery","percentage":60},{"id":"heavy_weapons","skill":"Heavy Weapons","percentage":50},{"id":"ride","skill":"Ride","percentage":60}],"description":"You serve and protect. Police officers walk the beat in uniform. Deputy sheriffs answer to an elected law enforcer and have jurisdiction over an entire county. Detectives come in after the fact and put the pieces together.","recommended_stats":"STR, CON, POW","choose":1,"bonds":3},"scientist":{"id":"scientist","name":"Scientist","skills":[{"id":"bureaucracy","skill":"Bureaucracy","percentage":40},{"id":"computer_science","skill":"Computer Science","percentage":40},{"id":"science_1","skill":"Science","percentage":60,"type":""},{"id":"science_2","skill":"Science","percentage":50,"type":""},{"id":"science_3","skill":"Science","percentage":50,"type":""}],"options":[{"id":"accounting","skill":"Accounting","percentage":50},{"id":"craft_1","skill":"Craft","percentage":40,"type":""},{"id":"foreign_language_1","skill":"Foreign Language","percentage":40,"type":""},{"id":"forensics","skill":"Forensics","percentage":40},{"id":"law","skill":"Law","percentage":40},{"id":"pharmacy","skill":"Pharmacy","percentage":40}],"description":"You expand human knowledge in a field such as biology, physics, or chemistry. When certain forms of knowledge cause insanity and death, it’s easy to conclude that some hypotheses should not be tested.","recommended_stats":"INT","choose":3,"bonds":4},"soldier_or_marine":{"id":"soldier_or_marine","name":"Soldier or Marine","skills":[{"id":"alertness","skill":"Alertness","percentage":50},{"id":"athletics","skill":"Athletics","percentage":50},{"id":"bureaucracy","skill":"Bureaucracy","percentage":30},{"id":"drive","skill":"Drive","percentage":40},{"id":"firearms","skill":"Firearms","percentage":40},{"id":"first_aid","skill":"First Aid","percentage":40},{"id":"military_science_1","skill":"Military Science","percentage":40,"type":"Land"},{"id":"navigate","skill":"Navigate","percentage":40},{"id":"persuade","skill":"Persuade","percentage":30},{"id":"unarmed_combat","skill":"Unarmed Combat","percentage":50}],"options":[{"id":"artillery","skill":"Artillery","percentage":40},{"id":"computer_science","skill":"Computer Science","percentage":40},{"id":"craft_1","skill":"Craft","percentage":40,"type":""},{"id":"demolitions","skill":"Demolitions","percentage":40},{"id":"foreign_language_1","skill":"Foreign Language","percentage":40,"type":""},{"id":"heavy_machinery","skill":"Heavy Machinery","percentage":50},{"id":"heavy_weapons","skill":"Heavy Weapons","percentage":40},{"id":"search","skill":"Search","percentage":60},{"id":"sigint","skill":"SIGINT","percentage":40},{"id":"swim","skill":"Swim","percentage":60}],"description":"Governments will always need boots on the ground and steady hands holding rifles. When war begins, civilization gets out of the way. With the social contract void, unnatural things creep in at the edges. There’s a reason Delta Green began in the military","recommended_stats":"STR, CON","choose":3,"bonds":4},"special_operator":{"id":"special_operator","name":"Special Operator","skills":[{"id":"alertness","skill":"Alertness","percentage":60},{"id":"athletics","skill":"Athletics","percentage":60},{"id":"demolitions","skill":"Demolitions","percentage":40},{"id":"firearms","skill":"Firearms","percentage":60},{"id":"heavy_weapons","skill":"Heavy Weapons","percentage":50},{"id":"melee_weapons","skill":"Melee Weapons","percentage":50},{"id":"military_science_1","skill":"Military Science","percentage":60,"type":"Land"},{"id":"navigate","skill":"Navigate","percentage":50},{"id":"stealth","skill":"Stealth","percentage":50},{"id":"survival","skill":"Survival","percentage":50},{"id":"swim","skill":"Swim","percentage":50},{"id":"unarmed_combat","skill":"Unarmed Combat","percentage":60}],"options":[],"recommended_stats":"STR, CON, POW","bonds":2}}
