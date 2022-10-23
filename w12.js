
class Assignment {
    constructor(first, last, dorm, room) {
        this.first = first;
        this.last = last;
        this.dorm = dorm;
        this.room = room;
    // How do I instantiate with this many constructors?    
    }
}

class AssignmentService {
    static url = 'https://635046bb3e9fa1244e43053a.mockapi.io/Student_Room_Assignments_API/room_app';

    static getAllAssignments() {
        // Grabbing all of the student room assignments from the API
        return $.get(this.url);
    }
    static getAssignment(id) {
        // Grabbing a specific assignment 
        return $.get(this.url + `/${id}`);
    }
    static createAssignment(assignment) {
        // Posting a new student room assignment to the API
        return $.post(this.url, assignment);
    }
    static updateAssignment(assignment) {
        // Editing a specific assignment
        return $.ajax({
            url: this.url + `/${assignment._id}`,
            dataType: 'json',
            data: JSON.stringify(assignment),
            contentType: 'application/json',
            type: 'Put'
        });
    }
    static deleteAssignment(id) {
        // Removing a specific assignment from the API
        
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'Delete'
        });    
        // const responsePromise = $.ajax({
        //     url: `${this.url}/${id}`,
        //     type: "DELETE",
        // });
        // return responsePromise;
    }
}

class DOMManager {
    // This is the code in which we will re-render our DOM each
    //  time we create a new class
    static assignments;

    static getAllAssignments() {
        AssignmentService.getAllAssignments().then(assignments => this.render(assignments));
    }

    static createAssignment(first, last, dorm, room) {
        AssignmentService.createAssignment(new Assignment(first, last, dorm, room))
        .then(() => {
            return AssignmentService.getAllAssignments();
        })
        .then((assignments) => this.render(assignments));
    }
    
    static deleteAssignment(id) {
        console.log(id);
        AssignmentService.deleteAssignment(id) // Deleting the assignment
            .then(() => {  // Then an http request is sent to get all of the assignments that now exist 
                return AssignmentService.getAllAssignments();
            })
            .then((assignments) => this.render(assignments));  // Then we re-render those assignments
    }

    static render(assignments) {
        this.assignments = assignments;
        $('#app').empty();

        // This is where I am building the HTML for every new assignment

        for (let assignment of assignments) {
            $('#app').prepend(
                `<div id="${assignment._id}" class="card">
                    <div class="card-body">
                        <p>
                            <span id="first-${assignment._id}"><strong>First Name: </strong>
                            ${assignment.first}</span>
                            <span id="last-${assignment._id}"><strong>Last Name: </strong>
                            ${assignment.last}</span>
                            <span id="dorm-${assignment._id}"><strong>Dorm: </strong>
                            ${assignment.dorm}</span>
                            <span id="room-${assignment._id}"><strong>Room: </strong>
                            ${assignment.room}</span>
                            <button class="btn btn-danger" onclick="DOMManager.deleteAssignment
                            ('${assignment._id}')">Delete</button>
                            
                        </p>
                    </div>
                </div><br>
                `
            );  // The above will display all of the properties of the current assignment
                // Each new assignment will have its own card
                // There is a code for a red button for deleting the assignment
        }    
    }
}

$('#submit').on('click', () => {
    DOMManager.createAssignment($('#first-name').val(), $('#last-name').val(), $('#dorm-name')
    .val(), $('#room-number').val());
    $('#first-name').val(''); 
    $('#last-name').val(''); 
    $('#dorm-name').val(''); 
    $('#room-number').val('');
});

DOMManager.getAllAssignments();
