if( !('CoC' in window ) ) { CoC = {}; }
if( !CoC.SkillTable ) { CoC.SkillTable= {}; }
if( !CoC.OccupationalSkillList ) { CoC.OccupationalSkillList= {}; }
if( !CoC.SkillPointObserver ) { CoC.SkillPointObserver= {}; }
if( !CoC.SubSkills ) { CoC.SubSkills= {}; }

CoC.SkillPointObserver = function(options) {
  this.occupationalSkillTableId = options.occupationalSkillTableId;
  this.occTotalId = options.occTotalId;
  this.piTotalId = options.piTotalId;
};

CoC.SkillPointObserver.prototype = {
  notify: function() {
    var self = this;
    var occupationalSkillTable = $('#'+self.occupationalSkillTableId);
    var occTotal = $('#'+self.occTotalId);
    var piTotal = $('#'+self.piTotalId);
    var occupationalSkills = _.map(
      $('td', occupationalSkillTable), function(td) {
        return $(td).attr('skill')
      }
    );

    var spentSkillInputs = _.filter($('.skill-table input.skill-input'), function(input) {
      return $(input).val() != '';
    });

    occTotal.html(occTotal.attr('original'));
    piTotal.html(piTotal.attr('original'));

    _.each(spentSkillInputs, function(input) {
      var skill = $(input).parents('td').attr('skill');
      if(_.include(occupationalSkills, skill)) {
        var currentTotal = parseInt(occTotal.html());
        var skillPoints = parseInt($(input).val()) || 0;
        var difference = currentTotal - skillPoints;
        if(difference < 0) {
          piTotal.html(parseInt(piTotal.html()) + difference);
          occTotal.html(0);
        } else {
          occTotal.html(difference);
        }
      } else {
        piTotal.html(parseInt(piTotal.html()) - (parseInt($(input).val()) || 0));
      }
    } );

    self.validate();
  },

  validate: function() {
    var self = this;
    _.each([$('#'+self.occTotalId), $('#'+self.piTotalId)], function(div) {
      if( parseInt(div.html()) < 0 ) {
        div.parent().attr('class', '');
        div.parent().addClass('red-sub-point-total');
        //todo fix this
//        div.parent().attr('errorMessage', 'You have exceeded your allotted skill points.');
      } else if( parseInt(div.html()) > 0 ) {
        div.parent().attr('class', '');
        div.parent().removeAttr('errorMessage');
        div.parent().addClass('blue-sub-point-total');
      } else {
        div.parent().attr('class', '');
        div.parent().removeAttr('errorMessage');
        div.parent().addClass('green-sub-point-total');
      }
    });
  }
};

CoC.SkillTable = function(options) {
  this.pointObserver = options.pointObserver;
  this.buildTable();
};

CoC.SkillTable.prototype = {
  buildTable: function() {
    var self = this;
    $('input.skill-input').change( function(event) {
      var input = $(event.target);
      var inputTd = input.parent('td');
      var skill = inputTd.attr('skill');
      var titleTd = inputTd.siblings('td.' + skill + '-title');
      var totalTd = inputTd.siblings('td.' + skill + '-total');
      var totalVal = Number(input.val()) + Number(titleTd.attr('base'));
      var categoryTitle = $($('input', titleTd)[0]);

      if(categoryTitle.size() > 0) {
        categoryTitle.change(function() { self.validateInput(totalVal, input, titleTd, categoryTitle); });
      }
      self.validateInput(totalVal, input, titleTd, categoryTitle);
      self.updateTotal(input, totalTd, totalVal);
      self.pointObserver.notify();
    });
  },

  validateInput: function(totalVal, input, titleTd, categoryTitle) {
    if(totalVal > 99 || (Number(input.val()) < 1 && input.val() != '')) {
      input.addClass('red');

      var skillTitle = titleTd.html().split('(')[0].trim();
      if(categoryTitle.size() > 0) {
        skillTitle = categoryTitle.val();
      }
      input.attr('errorMessage', 'Total skill value must not exceed 99 (' + skillTitle + ').')
    } else {
      input.removeClass('red');
      input.removeAttr('errorMessage')
    }
  },

  updateTotal: function(input, totalTd, totalVal) {
    if( input.val() ) {
      totalTd.html(totalVal);
    } else {
      totalTd.html('');
    }
  }

};

CoC.OccupationalSkillList = function(properties) {
  this.properties = properties;
};

CoC.OccupationalSkillList.prototype = {
  notify: function() {
    var self = this;
    $('#occupational_skill_table').html('');
    if($('#coc_skill_set_skill_occupation').val()) {
      self.updateOccupationSkillList();
      self.updateOccupationSkillOptions();
    }
  },

  //updates table with static skills
  updateOccupationSkillList: function() {
    var self = this;
    var skills = self.properties.occupations[$('#coc_skill_set_skill_occupation').val()].set;
    _.each(skills, function(skill) {
      $('#occupational_skill_table').append($('<tr>').
        append('<td skill="'+skill+'">' + CoC.humanize_sym(skill) + '</td>') );
    });
  },


  //updates table with select skills
  updateOccupationSkillOptions: function() {
    var self = this;
    var options = self.properties.occupations[$('#coc_skill_set_skill_occupation').val()].options;
    _.each(options, function(option) {
      var skillOptions;
      if(option == 'any') {
        skillOptions = self.properties.all_skills;
      } else {
        skillOptions = _.filter(self.properties.all_skills, function(skill) {
          return _.contains(option, skill[0]);
        });
      }

      var select = $('<select class="occupation-skill">');
      _.each(skillOptions, function(skill) {
        select.append($('<option>').
          val(skill[0]).
          append(CoC.humanize_sym(skill[0]))
        );
      });

      var td = $('<td skill="'+$('option:selected', select).val()+'">');
      select.change(function(event) {
        td.attr('skill', $('option:selected', event.target).val());
        self.properties.pointObserver.notify();
        self.updateOccupationSkillSelects();
      });
      $('#occupational_skill_table').append($('<tr>').
        append(td.append(select)));
    });

  },

  //update hidden field value to selected skills
  updateOccupationSkillSelects: function() {
    var occupation_skills = _.map($('.occupation-skill'), function(select) {
      return $(select).val();
    });
    $('#coc_skill_set_occupation_skills').val(JSON.stringify(occupation_skills));
  },

  //update selects to match saved values (from hidden field)
  setOccupationSkillSelects: function() {
    var skill_selects = $('.occupation-skill');
    var occ_skills = JSON.parse($('#occupation_skills').val());
    for( var i = 0; i < skill_selects.length; i++ ) {
      $(skill_selects[i]).val(occ_skills[i]);
      $(skill_selects[i]).change();
    }
  }
};

CoC.SubSkills = function(options) {
  var self = this;
  self.skill = options.skill;
  var i = 0;
  while($('#'+self.skill+i+'_title').size() > 0) {
    _.each([$('#'+self.skill+i+'_title'), $('#'+self.skill+i+'_val')], function(input) {
      $(input).change(function() { self.update() });
    });
    i++;
  }
};

CoC.SubSkills.prototype = {
  update: function() {
    var self = this;
    var values = { };
    var i = 0;
    while($('#'+this.skill+i+'_title').size() > 0) {
      values[$('#'+this.skill+i+'_title').val()] = $('#'+this.skill+i+'_val').val();
      i++;
    }
    $('#coc_skill_set_'+this.skill).val(JSON.stringify(values));
  }
};
