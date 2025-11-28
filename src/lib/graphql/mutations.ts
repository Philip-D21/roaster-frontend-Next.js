import { gql } from "@apollo/client";

export const ASSIGN_USER = gql`
  mutation AssignUserToShift($input: AssignShiftInput!) {
    assignUserToShift(input: $input) {
      id
      status
      userId
      shiftId
    }
  }
`;

export const PICK_UP_SHIFT = gql`
  mutation PickUpShift($shiftId: ID!) {
    pickUpShift(shiftId: $shiftId) {
      id
      status
      userId
      shiftId
    }
  }
`;

export const DELETE_ASSIGNMENT = gql`
  mutation DeleteAssignment($assignmentId: ID!) {
    deleteAssignment(assignmentId: $assignmentId)
  }
`;
