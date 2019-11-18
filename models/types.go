package models

// WordPair is for storing Word and its translation
type WordPair struct {
	Word        string //word you have learnt
	translation string //translation for that word
}

type User struct {
	DBModel
	Username string
	Name	 string
	Password string
}
