/// <reference path="typings/tsd.d.ts" />

interface ClassLevel
{
  name : string;
  level : number;
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
  classes : ClassLevel[];
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
    classes_text : function() {
      var classes : ClassLevel[] = this.classes || [];
      return classes.map(cl => cl.name + " " + cl.level).join(", ");
    },

    all_classes : function() {
      return AllClasses;
    }
  });

  Template["character_sheet"].events({
    "click .add_classes_select" : function(evt) {
      var className = evt.target.innerText;
      var char : Character = (<any>Template).parentData(1);
      var cl : ClassLevel = { name : className, level : 1 };
      CharacterDB.update(char._id, { $addToSet : { classes : cl } });
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
