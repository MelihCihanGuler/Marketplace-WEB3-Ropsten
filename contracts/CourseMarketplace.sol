// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
contract CourseMarketplace {

  constructor() {
    setContractOwner(msg.sender);
  }


  modifier onlyOwner() {
    if (msg.sender != getContractOwner()) {
      revert OnlyOwner();
    }
    _;
  }
     modifier onlyWhenNotStopped {
    require(!isStopped);
    _;
  }

  modifier onlyWhenStopped {
    require(isStopped);
    _;
  }

  enum State {
    Purchased,
    Activated,
    Deactivated
  }
  struct Course {
    uint id; // 32
    uint price; // 32
    bytes32 proof; // 32
    address owner; // 20
    State state; // 1
  }

  bool public isStopped = false;

  // mapping of courseHash to Course data
  mapping(bytes32 => Course) private ownedCourses;
  // mapping of courseID to courseHash
  mapping(uint => bytes32) private ownedCourseHash;
  // number of all courses + id of the course
  uint private totalOwnedCourses;

  address payable private owner;

//-------------------------------------------------- E R R O R   C A S E S *************************

  /// Course has invalid state!
  error InvalidState();

  /// Course is not created!
  error CourseIsNotCreated();

  /// Course has already a Owner!
  error CourseHasOwner();
  
  /// Only owner has an access!
  error OnlyOwner();

  /// Sender is not course owner!
  error SenderIsNotCourseOwner();

//-------------------------------------------------- E R R O R   C A S E S *************************

//-------------------------------------------------- F U N C T I O N S *************************


  receive() external payable {}

  function withdraw(uint amount) external onlyOwner {
    (bool success, ) = owner.call{value: amount}("");
    require(success, "Transfer failed.");
  }


  //address(this).balance smart contracttaki bakiyeyi gösterir
  function emergencyWithdraw() external onlyOwner {
    isStopped = true;
    (bool success, ) = owner.call{value: address(this).balance}("");
    require(success, "Transfer failed.");
  }


  // Contractı yok ettiğinde ownera parayı gönder demek
  function selfDestruct() external onlyWhenStopped onlyOwner {
    selfdestruct(owner);
  }


  function stopContract() external onlyOwner {
    isStopped = true;
  }


  function resumeContract() external onlyOwner {
    isStopped = false;
  }

  
  function transferOwnership(address newOwner) external onlyOwner {
    setContractOwner(newOwner);
  }


  function getContractOwner() public view returns (address) {
    return owner;
  }


  function setContractOwner(address newOwner) private {
    owner = payable(newOwner);
  }

// 0x00000000000000000000000000003130,
// 0x0000000000000000000000000000313000000000000000000000000000003130
  function purchaseCourse( bytes16 courseId, bytes32 proof)  external payable onlyWhenNotStopped{

    bytes32 courseHash = keccak256(abi.encodePacked(courseId, msg.sender));
    
    if (hasCourseOwnership(courseHash)) {
      revert CourseHasOwner();
    }

    uint id = totalOwnedCourses++;
    ownedCourseHash[id] = courseHash;
    ownedCourses[courseHash] = Course({
      id: id,
      price: msg.value,
      proof: proof,
      owner: msg.sender,
      state: State.Purchased
    });
  }

  function repurchaseCourse(bytes32 courseHash) external payable onlyWhenNotStopped{
    if (!isCourseCreated(courseHash)) {
      revert CourseIsNotCreated();
    }

    if (!hasCourseOwnership(courseHash)) {
      revert SenderIsNotCourseOwner();
    }

    Course storage course = ownedCourses[courseHash];

    if (course.state != State.Deactivated) {
      revert InvalidState();
    }

    course.state = State.Purchased;
    course.price = msg.value;
  }

    function activateCourse(bytes32 courseHash) external onlyWhenNotStopped onlyOwner {
    if (!isCourseCreated(courseHash)) {
      revert CourseIsNotCreated();
    }

    Course storage course = ownedCourses[courseHash];

    if (course.state != State.Purchased) {
      revert InvalidState();
    }

    course.state = State.Activated;
  }

  function deactivateCourse(bytes32 courseHash) external onlyWhenNotStopped onlyOwner {
    if (!isCourseCreated(courseHash)) {
      revert CourseIsNotCreated();
    }

    Course storage course = ownedCourses[courseHash];

    if (course.state != State.Purchased) {
      revert InvalidState();
    }

    // I F   D E A C T I V A T E D   S E N D   E T H E R   B A C K   T O   U S E R ------------
    (bool success, ) = course.owner.call{value: course.price}("");
    require(success, "Transfer failed!");

    course.state = State.Deactivated;
    course.price = 0;
  }

  function isCourseCreated(bytes32 courseHash)private view
    returns (bool)
  {
    return ownedCourses[courseHash].owner != 0x0000000000000000000000000000000000000000;
  }


  function getCourseCount() external view returns (uint) {
    return totalOwnedCourses;
  }

  function getCourseHashAtIndex(uint index) external view returns (bytes32){
    return ownedCourseHash[index];
  }

  function getCourseByHash(bytes32 courseHash) external view returns (Course memory) {
    return ownedCourses[courseHash];
  }

  function hasCourseOwnership(bytes32 courseHash)private view returns (bool){
    return ownedCourses[courseHash].owner == msg.sender;
  }

  //-------------------------------------------------- F U N C T I O N S *************************
}