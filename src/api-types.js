// @flow

export type ResourceReference = {
  resourceId: string,
  resource: string
};

export type FamiliesApiResponse = {
  relationships: Array<{
    type: string,
    facts: Array<any>,
    person1: {resourceId: string},
    person2: {resourceId: string},
  }>,
  childAndParentsRelationships: Array<{
    // father: {resourceId: string},
    // mother: {resourceId: string},
    parent1: {resourceId: string},
    parent2: {resourceId: string},
    child: {resourceId: string},
  }>,
  persons: Array<Person>,
}

export type FamilyView = {
  father: ResourceReference, // A reference to a parent in the family. The name "parent1" is used only to distinguish it from the other parent in this family and implies neither order nor role.
  mother: ResourceReference, // A reference to a parent in the family. The name "parent2" is used only to distinguish it from the other parent in this family and implies neither order nor role.
  children: Array<ResourceReference> // A list of references to the children of this family.
};

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
  familiesAsChild: Array<FamilyView> // The family views where this person is a child
};

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
  identifiers: { [key: string]: Array<string> } //	The list of identifiers for the agent.
  // extracted: boolean, // Whether this subject has been identified as "extracted", meaning it captures information extracted from a single source.	FTU

  // attribution: Attribution, // Attribution metadata for a conclusion.
  // sources: Array<SourceReference>, //	The source references for a conclusion.
  // analysis: ResourceReference	A reference to the analysis document explaining the analysis that went into this conclusion.	FTU
  // notes: Array<Note>, //	Notes about a person.
  // lang: string	The language of the conclusion. See http://www.w3.org/International/articles/language-tags/	FTR
  // confidence: string	The level of confidence the contributor has about the data.
  // sortKey: string	A sort key in relation to other facts for display purposes.
};

// Stories stuff
export type TextValue = {
  lang: string,
  value: string
};

export type Note = {
  subject: string, // The subject of the note. This is a short title describing the contents of the note text.
  text: string, // The text of the note.
  // attribution: Attribution, // Attribution metadata for a note.
  lang: string, // The language of the note. See http://www.w3.org/International/articles/language-tags/	FTU
  // links: map of Link	The list of hypermedia links. Links are not specified by GEDCOM X core, but as extension elements by GEDCOM X RS.
  id: string // A local, context-specific id for the data.
};

export type SourceDescription = {
  // citations: Array<SourceCitation>, // The bibliographic citations for this source.
  mediator: ResourceReference, // A reference to the entity that mediates access to the described source.
  publisher: ResourceReference, // A reference to the entity responsible for making the described source available.
  // sources: Array<SourceReference>, // References to any sources to which this source is related (usually applicable to sources that are derived from or contained in another source).
  analysis: ResourceReference, // A reference to the analysis document explaining the analysis that went into this description of the source.
  // componentOf: SourceReference, // A reference to the source that contains this source.
  titles: Array<TextValue>, // A list of titles for this source.
  notes: Array<Note>, // Notes about a source.
  // identifiers: map of Array<string>, // The list of identifiers for the agent.
  rights: string, // The rights for this source.
  replacedBy: string, // The URI that this resource has been replaced by.
  replaces: string, // The list of resources that this resource replaces.
  statuses: string, // The list of status types for the source.
  lang: string, // The language of this genealogical data set. See http://www.w3.org/International/articles/language-tags/. Note that some language-enabled elements MAY override the language.
  about: string, // The URI (if applicable) of the actual source.
  version: string, // gets the version of this resource
  resourceType: string, // The type of the resource being described.
  mediaType: string, // Hint about the media (MIME) type of the resource being described.
  // links: map of Link	The list of hypermedia links. Links are not specified by GEDCOM X core, but as extension elements by GEDCOM X RS.
  // Properties: inherited from ExtensibleData
  id: string // A local, context-specific id for the data.
};

type Links = {
  next: { href: string },
  last: { href: string },
  self: { href: string },
  first: { href: string }
};

export type MemoriesResponse = {
  links: Links,
  persons: Array<Person>,
  sourceDescriptions: Array<SourceDescription>
};

// User

export type User = {
  contactName: string,
  helperAccessPin: string,
  fullName: string,
  givenName: string,
  familyName: string,
  email: string,
  alternateEmail: string,
  country: string,
  gender: string,
  birthDate: string,
  phoneNumber: string,
  mobilePhoneNumber: string,
  mailingAddress: string,
  preferredLanguage: string,
  displayName: string,
  personId: string,
  treeUserId: string,
  // links: map, of Link	The list of hypermedia links. Links are not specified by GEDCOM X core, but as extension elements by GEDCOM X RS.
  id: string
};
