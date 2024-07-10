pragma solidity ^0.8.0;

contract KYC {
    // Mapping of user addresses to their KYC status
    mapping (address => KYCStatus) public kycStatus;

    // Mapping of user addresses to their KYC submission timestamps
    mapping (address => uint256) public kycSubmissionTimestamps;

    // Mapping of user addresses to their KYC approval timestamps
    mapping (address => uint256) public kycApprovalTimestamps;

    // Event emitted when a user's KYC status is updated
    event KYCStatusUpdated(address user, KYCStatus status);

    // Event emitted when a user submits KYC information
    event KYCSubmission(address user, uint256 timestamp);

    // Event emitted when a user's KYC submission is approved or rejected
    event KYCApproval(address user, bool approved, uint256 timestamp);

    enum KYCStatus {
        NOT_STARTED,
        IN_PROGRESS,
        APPROVED,
        REJECTED
    }

    struct UserKYC {
        KYCStatus status;
        string firstName;
        string lastName;
        string email;
        string phoneNumber;
        string address;
        string idType;
        string idNumber;
        uint256 submissionTimestamp;
        uint256 approvalTimestamp;
    }

    /**
     * @dev Initializes the contract
     */
    constructor() public {
        // Initialize the KYC status of all users to NOT_STARTED
        for (address user in users) {
            kycStatus[user] = KYCStatus.NOT_STARTED;
        }
    }

    /**
     * @dev Submits KYC information for a user
     * @param _user Address of the user submitting KYC information
     * @param _firstName First name of the user
     * @param _lastName Last name of the user
     * @param _email Email address of the user
     * @param _phoneNumber Phone number of the user
     * @param _address Address of the user
     * @param _idType Type of ID (e.g. passport, driver's license)
     * @param _idNumber ID number
     */
    function submitKYC(address _user, string memory _firstName, string memory _lastName, string memory _email, string memory _phoneNumber, string memory _address, string memory _idType, string memory _idNumber) public {
        require(kycStatus[_user] == KYCStatus.NOT_STARTED, "KYC process already started for this user");

        kycStatus[_user] = KYCStatus.IN_PROGRESS;
        UserKYC storage userKYC = kycStatus[_user];
        userKYC.firstName = _firstName;
        userKYC.lastName = _lastName;
        userKYC.email = _email;
        userKYC.phoneNumber = _phoneNumber;
        userKYC.address = _address;
        userKYC.idType = _idType;
        userKYC.idNumber = _idNumber;
        userKYC.submissionTimestamp = block.timestamp;

        kycSubmissionTimestamps[_user] = block.timestamp;

        emit KYCStatusUpdated(_user, KYCStatus.IN_PROGRESS);
        emit KYCSubmission(_user, block.timestamp);
    }

    /**
     * @dev Approves or rejects a user's KYC submission
     * @param _user Address of the user whose KYC submission is being approved or rejected
     * @param _approved True if the KYC submission is approved, false otherwise
     */
    function approveKYC(address _user, bool _approved) public {
        require(kycStatus[_user] == KYCStatus.IN_PROGRESS, "KYC process not in progress for this user");

        if (_approved) {
            kycStatus[_user] = KYCStatus.APPROVED;
        } else {
            kycStatus[_user] = KYCStatus.REJECTED;
        }

        userKYC.approvalTimestamp = block.timestamp;

        kycApprovalTimestamps[_user] = block.timestamp;

        emit KYCStatusUpdated(_user, kycStatus[_user]);
        emit KYCApproval(_user, _approved, block.timestamp);
    }

    /**
     * @dev Checks if a user's KYC status is approved
     * @param _user Address of the user to check
     * @return True if the user's KYC status is approved, false otherwise
     */
    function isKYCApproved(address _user) public view returns (bool) {
        return kycStatus[_user] == KYCStatus.APPROVED;
    }

    /**
     * @dev Gets the timestamp of a user's KYC submission
     * @param _user Address of the user to get the submission timestamp for
     * @return Timestamp of the user's KYC submission
     */
    function getKYCSubmissionTimestamp(address _user) public view returns (uint256) {
return kycSubmissionTimestamps[_user];
    }

    /**
     * @dev Gets the timestamp of a user's KYC approval
     * @param _user Address of the user to get the approval timestamp for
     * @return Timestamp of the user's KYC approval
     */
    function getKYCApprovalTimestamp(address _user) public view returns (uint256) {
        return kycApprovalTimestamps[_user];
    }
}