import PTEActorBase from "./base-actor.mjs";

export default class PTECharacter extends PTEActorBase {

  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    schema.attributes = new fields.SchemaField({
      level: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 1 })
      }),
    });

    // Iterate over combat stat names and create a new SchemaField for each.
    schema.stats = new fields.SchemaField(Object.keys(CONFIG.POKEMON_TABLETOP_EVOLUTION.stats).reduce((obj, stat) => {
      obj[stat] = new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 5, min: 0 }),
      });
      return obj;
    }, {}));

    // Iterate over skills and create a new SchemaField for each.
    schema.skills = new fields.SchemaField(Object.keys(CONFIG.POKEMON_TABLETOP_EVOLUTION.skills).reduce((obj, skill) => {
      obj[skill] = new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 2, min: 0 })
      });
      return obj;
    }, {}));

    return schema;
  }

  prepareDerivedData() {
    // Use for hp tick and base evasion stat calculations which seem to work the same for Pokemon and trainers
    // I don't love this implementation; stats should be treated as largely interchangeable with the same basic properties (values, labels, etc).
    // Perhaps the calculated values should be captured elsewhere.

    // pre-calculate one tick of hp
    this.stats['hp'].tick = Math.floor(this.stats['hp'].value / 10);

    // inititative modifier
    this.stats['speed'].mod = Math.floor(this.stats['speed'].value / 5);

    // speed evasion (evasion vs. any), capped at 9
    this.stats['speed'].evasion = Math.min(9, Math.floor(this.stats['speed'].value / 5));

    // Loop through ability scores, and add their modifiers to our sheet output.
    for (const key in this.stats) {
      // Handle ability label localization.
      this.stats[key].label = game.i18n.localize(CONFIG.POKEMON_TABLETOP_EVOLUTION.stats[key]) ?? key;
    }

  }

  prepareSkillDicePools() {
    for (const key in this.skills) {
        this.skills[key].dicePool = this.skills[key].value
    }
  }

  getRollData() {
    const data = {};

    // Copy the skills to the top level, so that rolls can use
    // formulas like `@persuasion.mod + 4`.
    if (this.skills) {
      for (let [k,v] of Object.entries(this.skills)) {
        data[k] = foundry.utils.deepClone(v);
      }
    }
    if (this.skills) {
      for (let [k,v] of Object.entries(this.skills)) {
        data[k] = foundry.utils.deepClone(v);
      }
    }

    data.lvl = this.attributes.level.value;

    return data
  }
}
