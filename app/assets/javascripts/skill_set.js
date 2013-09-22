if( !('CoC' in window ) ) { CoC = {}; }
if( !CoC.SkillTable ) { CoC.SkillTable= {}; }
if( !CoC.OccupationalSkillList ) { CoC.OccupationalSkillList= {}; }

CoC.SkillTable = function(options) {
  this.table = $('#'+options.tableId);
  this.allSkills = options.allSkills;
  this.skillCategories = options.skillCategories;
  this.occTotal = $('#'+options.occTotalId);
  this.piTotal = $('#'+options.piTotalId);
  this.occupationalSkillTable = $('#'+options.occupationalSkillTable);
  this.buildTable();
};

CoC.SkillTable.prototype = {
  buildTable: function() {
    var self = this;
    var skillCategoryNames = _.map(self.skillCategories, function(sc) { return sc[0]} );
    _.each(self.allSkills, function( skillPair ) {
      var skillNameTd = $('<td>').append(CoC.humanize_sym(skillPair[0]));
      var skillBaseTd = $('<td class="skill_base">').append(skillPair[1]);
      var skillInput = $('<input class="skill" type="text"/>');
      var skillInputTd = $('<td>').append(skillInput);
      var skillTotalTd = $('<td class="skill_total">');

      if(_.contains(skillCategoryNames, skillPair[0])) {
        self.table.append( $('<tr>').append(skillNameTd ));

        var subCatTd = $('<td>').append($('<input type="text">'))
        _.each([1,2,3], function(i) {
          var tr = $('<tr skill="'+skillPair[0]+'">').
            append( subCatTd.clone()).
            append( skillBaseTd.clone() ).
            append( skillInputTd.clone()).
            append( skillTotalTd.clone() );
          self.table.append(tr);
        });
      } else {
        var tr = $('<tr skill="'+skillPair[0]+'">').
          append( skillNameTd ).
          append( skillBaseTd).
          append( skillInputTd ).
          append( skillTotalTd );
        self.table.append( tr );
      }
    });

    $('input.skill').change( function(event) {
      var input = $(event.target);
      var parentTr = input.parents('tr');
      var skillTotalTd = $('td.skill_total', parentTr);
      var skillBaseTd = $('td.skill_base', parentTr);
      if(input.val() == '') {
        skillTotalTd.html('');
      } else {
        skillTotalTd.html(parseInt(input.val()) + parseInt(skillBaseTd.html()));
      }
      self.updateSpentTotals();
    });
  },

  updateSpentTotals: function() {
    var self = this;
    var occupationalSkills = _.map(
      $('td', self.occupationalSkillTable), function(td) {
        return $(td).attr('skill')
      }
    );

    var spentSkillInputs = _.filter($('input.skill', self.table), function(input) {
      return $(input).val() != '';
    });

    self.occTotal.html(self.occTotal.attr('original'));
    self.piTotal.html(self.piTotal.attr('original'));

    _.each(spentSkillInputs, function(input) {
      var skill = $(input).parents('tr').attr('skill');
      if(_.include(occupationalSkills, skill)) {
        self.occTotal.html(
          parseInt(self.occTotal.html()) - parseInt($(input).val())
        );
      } else {
        self.piTotal.html(
          parseInt(self.piTotal.html()) - parseInt($(input).val())
        );
      }
    } );
  }
};

CoC.OccupationalSkillList = function(properties) {
  var self = this;
  self.properties = properties;

  $('#'+self.properties.skill_occupation).
    change( function() { self.updateOccupation(); } );

};

CoC.OccupationalSkillList.prototype = {

  updateOccupation: function() {
    var self = this;
    self.occupationSkillList().html('');
    if(self.occupation()) {
      self.updateOccupationSkillList();
      self.updateOccupationSkillOptions();
    }
  },

  occupation: function() {
    return $('#'+this.properties.skill_occupation).val();
  },

  occupationSkillList: function() {
    return $('#'+this.properties.occupational_skill_table);
  },

  updateOccupationSkillList: function() {
    var self = this;
    var skills = self.properties.occupations[self.occupation()].set;
    _.each(skills, function(skill) {
      self.occupationSkillList().append($('<tr>').
        append('<td skill="'+skill+'">' + CoC.humanize_sym(skill) + '</td>') );
    });
  },

  updateOccupationSkillOptions: function() {
    var self = this;
    var options = self.properties.occupations[self.occupation()].options
    _.each(options, function(option) {
      var skillOptions;
      if(option == 'any') {
        skillOptions = self.properties.all_skills;
      } else {
        skillOptions = _.filter(self.properties.all_skills, function(skill) {
          return _.contains(option, skill[0]);
        });
      }

      var select = $('<select>');
      _.each(skillOptions, function(skill) {
        select.append($('<option>').
          val(skill[0]).
          append(CoC.humanize_sym(skill[0]))
        );
      });

      var td = $('<td skill="'+$('option:selected', select).val()+'">');
      select.change(function(event) {
        td.attr('skill', $('option:selected', event.target).val());
      });
      self.occupationSkillList().append($('<tr>').
        append(td.append(select)));
    });

  }
};