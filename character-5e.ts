/// <reference path="typings/tsd.d.ts" />

interface ClassLevel
{
    [name : string] : number;
}

interface Abilities
{
  strength : number;
  dexterity : number;
  constitution : number;
  intelligence : number;
  wisdom : number;
  charisma : number;
}

interface Character
{
  _id ?: string;
  name : string;
  classes : ClassLevel;
  background : string;
  playerName : string;
  race : string;
  alignment : string;
  xp : number;
  abilities : Abilities;
  // TODO: proficiencies?
}

declare var CharacterDB : Mongo.Collection<Character>;
CharacterDB = new Mongo.Collection<Character>("CharacterDB");

var AllClasses = ["Cleric", "Fighter", "Rogue", "Wizard", "Barbarian", "Druid", "Paladin", "Sorcerer", "Bard", "Monk", "Ranger", "Warlock"].sort();

if (Meteor.isClient) {
  (<any>Template).registerHelper("key_value", function(context, options) {
    var result = [];
    _.each(context, function(value, key, list){
      result.push({key:key, value:value});
    })
    return result;
  });

  Template["character_list"].helpers({
    all_characters: function() {
      return CharacterDB.find({});
    }
  });

  Template["character_list"].events({
    "click #new_character" : function() {
      CharacterDB.insert({ name : "Character name" });
    }
  });

  Template["character_sheet"].helpers({
    new_classes : function() {
      var classLevels : ClassLevel = this.classes || {};
      var classes = Object.keys(classLevels);
      return AllClasses.filter(v => classes.indexOf(v) == -1);
    },

    to_modifier : function(num : number) {
      return (((num || 10) - 10) / 2).toFixed(0);
    }
  });

  Template["character_sheet"].events({
    "click .add_classes_select" : function(evt) {
      var className = evt.target.innerText;
      var char : Character = (<any>Template).parentData(1);
      char.classes = char.classes || {};
      char.classes[className] = 1;
      CharacterDB.update(char._id, char);
    },

    "click .add_level" : function(evt) {
      var className = evt.target.getAttribute("className");
      var char : Character = (<any>Template).parentData(1);
      char.classes[className] += 1;
      CharacterDB.update(char._id, char);
    },

    "click .remove_level" : function(evt) {
      var className = evt.target.getAttribute("className");
      var char : Character = (<any>Template).parentData(1);
      char.classes[className] -= 1;
      if (char.classes[className] == 0)
        delete char.classes[className];
      CharacterDB.update(char._id, char);
    },
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
