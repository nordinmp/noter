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
	description: string
	isShared: bool - så skal det uploades til firestore
	Story: string
	id: string
	isFavorite: bool
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
	


For later use
``` dart
Future<List<Map<String, dynamic>>> _getID(String userId) async {  
  List<Map<String, dynamic>> photosData = [];  
  
  // Fetch the 'id' from the 'stories' collection  
  QuerySnapshot storiesSnapshot = await FirebaseFirestore.instance  
      .collection('users')  
      .doc(userId)  
      .collection('stories')  
      .get();  
  
  // Use a loop to fetch documents until photosData is not empty  
  for (var doc in storiesSnapshot.docs) {  
    String storyId = doc['id'];  
  
    // Use the 'id' to query the 'photos' collection where the 'story' field matches the 'id'  
    QuerySnapshot photosSnapshot = await FirebaseFirestore.instance  
        .collection('users')  
        .doc(userId)  
        .collection('photos')  
        .where('story', isEqualTo: storyId)  
        .get();  
  
    // Map the documents where the 'story' matches the 'id'  
    photosData = photosSnapshot.docs.map((doc) => doc.data() as Map<String, dynamic>).toList();  
  
    // If photosData is not empty, break the loop  
    if (photosData.isNotEmpty) {  
      break;  
    }  
  }  
  
  print(photosData);  
  
  return photosData;  
}
```
