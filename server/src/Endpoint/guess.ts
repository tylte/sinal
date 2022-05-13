export enum LetterResult {
    RIGHT_POSITION,
    FOUND,
    NOT_FOUND
}

export function get_guess(id: string, word: string, tab: Map<string, string>) {
    let soluce = tab.get(id);
    if ( soluce === undefined )
        soluce = ""
    let ret : number[] = new Array(word.length);
    let found : Map<string, number> = new Map();    //this Map is use to count the number of occurence of each character

    //initialise the return array with RIGHT_POSITION if the character is the same, else with NOT_FOUND
    for ( let i = 0; i < word.length; i++ ) {
        let char = word.charAt(i);
        if ( !found.has(char) )
            found.set(char, 0);

        if ( soluce.charAt(i) == char ) {
            ret[i] = LetterResult.RIGHT_POSITION;
        } else {
            ret[i] = LetterResult.NOT_FOUND;
        }
    }
        
    //for each letter, if it's somewhere else in the soluce word and the nb of occurence is set to 0, then the value FOUND is set in the array
    for ( let i = 0; i < word.length; i++ ) {
        if ( ret[i] == LetterResult.RIGHT_POSITION )
        continue;
        
        let char = word.charAt(i);
        for ( let j = 0; j < word.length; j++ ) {
            if ( soluce.charAt(j) == char && i != j ) {
                let nb = found.get(char);
                if ( nb !== undefined && ret[j] != LetterResult.RIGHT_POSITION ) {
                    if ( nb == 0 ) {
                        ret[i] = LetterResult.FOUND;
                        found.set(char, nb+1);
                    } else {
                        found.set(char, nb-1); 
                    }
                }
            }
        }
    }

    return ret;
}
