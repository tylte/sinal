export const RIGHT_POSITION = 1;
export const FOUND = 2;
export const NOT_FOUND = 3;

export function get_guess(id: string, word: string, tab: Map<string, string>) {
    let soluce = tab.get(id);
    if ( soluce === undefined )
        soluce = ""
    let ret : number[] = new Array(word.length);
    let found : Map<string, number> = new Map();

    for ( let i = 0; i < word.length; i++ ) {
        ret[i] = NOT_FOUND;
        let char = word.charAt(i);
        if ( !found.has(char) )
            found.set(char, 0);

        if ( soluce.charAt(i) == char ) {
            ret[i] = RIGHT_POSITION;
            let nb = found.get(char);
            if ( nb !== undefined )
                found.set(char, nb+1);
        }
    }
        
    for ( let i = 0; i < word.length; i++ ) {
        let char = word.charAt(i);
        for ( let j = 0; j < word.length; j++ ) {
            if ( soluce.charAt(j) == char && i != j ) {
                let nb = found.get(char);
                if ( nb !== undefined ) {
                    if ( nb == 0 ) {
                        ret[i] = FOUND;
                        found.set(char, nb+1);
                    } else 
                        found.set(char, nb-1);   
                }
            }
        }
    }

    return ret;
}
