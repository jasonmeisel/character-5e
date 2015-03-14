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
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
