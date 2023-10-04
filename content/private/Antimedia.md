Story.dart
- Check what id matches with what the image is sending
- find image path for that story
- insert in fab

Data about user:
	Name: string
	id: string
	hasPremium: bool
	dateCreated: dateTime
	ActiveStories: number
	Streak: Number
	finishedStories: number
	daysCaptured: number
Image data
	Path: string
	dateTaken: dateTime
	late: bool
	description: string
	isShared: bool - så skal det uploades til firestore
	Story: string
	id: string
Story data
	actionClips (tags) : array
	default: bool
	endDate: dateTime
	startTime: dateTime
	id: string
	imagePath: string
	Title: string
	isShared: bool
		users: array (med user id)
	status: string (aktiv done ovs)
	
	