
export  class TimeService{

    public static calculateTimespanInSeconds(start:Date, end:Date){
        let diff = end.getTime() - start.getTime();
        let seconds = Math.floor(diff / (1000));

        return seconds;
    }
}