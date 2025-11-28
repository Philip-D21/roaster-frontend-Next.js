import { gql } from "@apollo/client";

export const GET_SHIFTS = gql`
  query GetShifts {
    shifts {
      id
      date
      startTime
      endTime
      title
      maxAssignments
      currentAssignments
      availableSlots
    }
  }
`;

export const GET_OPEN_SHIFTS = gql`
  query GetOpenShifts($startDate: String, $endDate: String) {
    openShifts(startDate: $startDate, endDate: $endDate) {
      id
      date
      startTime
      endTime
      title
      maxAssignments
      currentAssignments
      availableSlots
    }
  }
`;

export const MY_SHIFTS = gql`
  query MyShifts($startDate: Date, $endDate: Date) {
    myShifts(startDate: $startDate, endDate: $endDate) {
      id
      status
      shift {
        id
        date
        startTime
        endTime
        title
      }
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
      role
    }
  }
`;
