// @flow

export type ResourceReference = {
    resourceId: string,
    resource: string,
}

export type FamilyView = {
    parent1: ResourceReference, // A reference to a parent in the family. The name "parent1" is used only to distinguish it from the other parent in this family and implies neither order nor role.	
    parent2: ResourceReference, // A reference to a parent in the family. The name "parent2" is used only to distinguish it from the other parent in this family and implies neither order nor role.	
    children: Array<ResourceReference> // A list of references to the children of this family.
}

export type DisplayProperties = {
    name: string, // The displayable name of the person.	
    gender: string, // The displayable label for the gender of the person.	
    lifespan: string, // The displayable label for the lifespan of the person.	
    birthDate: ?string, // The displayable label for the birth date of the person.	
    birthPlace: ?string, // The displayable label for the birth place of the person.	
    deathDate: ?string, // The displayable label for the death date of the person.	
    deathPlace: ?string, // The displayable label for the death place of the person.	
    marriageDate: ?string, // The displayable label for the marriage date of the person.	
    marriagePlace: ?string, // The displayable label for the marriage place of the person.	
    ascendancyNumber: string, // The context-specific ascendancy number for the person in relation to the other persons in the request. The ancestry number is defined using the Ahnentafel numbering system.	
    descendancyNumber: string, // The context-specific descendancy number for the person in relation to the other persons in the request. The descendancy number is defined using the d'Aboville numbering system.	
    familiesAsParent: Array<FamilyView>, // The family views where this person is a parent	
    familiesAsChild: Array<FamilyView>, // The family views where this person is a child
}

export type Person = {
    id: string,
    private: boolean, // Whether this person has been designated for limited distribution or display.	
    living: boolean, // Living status of the person as treated by the system. The value of this property is intended to be based on a system-specific calculation and therefore has limited portability. Conclusions about the living status of a person can be modeled with a fact.	FTR
    // gender: Gender, // The gender conclusion for the person.	
    // names: Array<Name>, // The name conclusions for the person.	
    // facts: Array<Fact>, // The fact conclusions for the person.	
    display: DisplayProperties, // Display properties for the person. Display properties are not specified by GEDCOM X core, but as extension elements by GEDCOM X RS.	

// evidence: Array<EvidenceReference>, //	References to the evidence being referenced for this subject.	
// media: Array<SourceReference>, //	References to multimedia resources associated with this subject.	
    identifiers: {[key: string]: Array<string>}, //	The list of identifiers for the agent.	
// extracted: boolean, // Whether this subject has been identified as "extracted", meaning it captures information extracted from a single source.	FTU

// attribution: Attribution, // Attribution metadata for a conclusion.	
// sources: Array<SourceReference>, //	The source references for a conclusion.	
// analysis: ResourceReference	A reference to the analysis document explaining the analysis that went into this conclusion.	FTU
// notes: Array<Note>, //	Notes about a person.	
// lang: string	The language of the conclusion. See http://www.w3.org/International/articles/language-tags/	FTR
// confidence: string	The level of confidence the contributor has about the data.	
// sortKey: string	A sort key in relation to other facts for display purposes.

}