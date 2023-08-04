export default interface IFilterProps {
    setDistanceFilter: (value: number) => void;
    setTypesFilter: (value: string[]) => void;
    setDateFilter: (value: Date) => void;
    setTimeFilter: (value: number) => void;
  }