/**
 * Extend the base PTEActor document by defining a custom roll data structure for trainer actors
 * @extends {PTEActor}
 */
export class PTETrainer extends PTEActor {

  /** @override */
  prepareData() {
    // Prepare data for the actor. Calling the super version of this executes
    // the following, in order: data reset (to clear active effects),
    // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
    // prepareDerivedData().
    super.prepareData();
  }


}
