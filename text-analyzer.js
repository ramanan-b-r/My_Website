document.addEventListener('DOMContentLoaded', function() {
    const analyzeButton = document.getElementById('analyzeButton');
      analyzeButton.addEventListener('click', function() {
        const text = document.getElementById('textInput').value;
        
        analyzeText(text);
    });

    function analyzeText(text) {
        const letters = (text.match(/[a-zA-Z]/g) || []).length;
        const words = countWords(text);
        const spaces = (text.match(/\s/g) || []).length;
        const newlines = (text.match(/\n/g) || []).length;
        const specialSymbols = (text.match(/[^\w\s]/g) || []).length;

        const pronouns = {
            'i': 0, 'me': 0, 'my': 0, 'mine': 0, 'myself': 0,
            'you': 0, 'your': 0, 'yours': 0, 'yourself': 0, 'yourselves': 0,
            'he': 0, 'him': 0, 'his': 0, 'himself': 0,
            'she': 0, 'her': 0, 'hers': 0, 'herself': 0,
            'it': 0, 'its': 0, 'itself': 0,
            'we': 0, 'us': 0, 'our': 0, 'ours': 0, 'ourselves': 0,
            'they': 0, 'them': 0, 'their': 0, 'theirs': 0, 'themselves': 0,
            'this': 0, 'that': 0, 'these': 0, 'those': 0
        };

        const prepositions = {
            'about': 0, 'above': 0, 'across': 0, 'after': 0, 'against': 0, 'along': 0, 
            'among': 0, 'around': 0, 'at': 0, 'before': 0, 'behind': 0, 'below': 0, 
            'beneath': 0, 'beside': 0, 'between': 0, 'beyond': 0, 'by': 0, 'despite': 0, 
            'down': 0, 'during': 0, 'except': 0, 'for': 0, 'from': 0, 'in': 0, 
            'inside': 0, 'into': 0, 'like': 0, 'near': 0, 'of': 0, 'off': 0, 
            'on': 0, 'onto': 0, 'out': 0, 'outside': 0, 'over': 0, 'past': 0, 
            'since': 0, 'through': 0, 'throughout': 0, 'to': 0, 'toward': 0, 'towards': 0, 
            'under': 0, 'underneath': 0, 'until': 0, 'up': 0, 'upon': 0, 'with': 0, 
            'within': 0, 'without': 0
        };

        const indefiniteArticles = {
            'a': 0, 'an': 0, 'the': 0, 'some': 0, 'any': 0
        };

        const tokens = text.toLowerCase().match(/\b\w+\b/g) || [];

        tokens.forEach(token => {
            if (token in pronouns) {
                pronouns[token]++;
            }
            if (token in prepositions) {
                prepositions[token]++;
            }
            if (token in indefiniteArticles) {
                indefiniteArticles[token]++;
            }
        });

        displayResults({
            basicStats: { letters, words, spaces, newlines, specialSymbols },
            pronouns: filterZeroValues(pronouns),
            prepositions: filterZeroValues(prepositions),
            indefiniteArticles: filterZeroValues(indefiniteArticles)
        });
    }

    function countWords(text) {
        return (text.match(/\b\w+\b/g) || []).length;
    }

    function filterZeroValues(obj) {
        const filtered = {};
        for (const key in obj) {
            if (obj[key] > 0) {
                filtered[key] = obj[key];
            }
        }
        return filtered;
    }

    function displayResults(results) {
        document.getElementById('lettersCount').textContent = results.basicStats.letters;
        document.getElementById('wordsCount').textContent = results.basicStats.words;
        document.getElementById('spacesCount').textContent = results.basicStats.spaces;
        document.getElementById('newlinesCount').textContent = results.basicStats.newlines;
        document.getElementById('specialSymbolsCount').textContent = results.basicStats.specialSymbols;
        
        const pronounsTable = document.getElementById('pronounsTable');
        pronounsTable.innerHTML = ''; 
        for (const pronoun in results.pronouns) {
            const row = pronounsTable.insertRow();
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);
            cell1.textContent = pronoun;
            cell2.textContent = results.pronouns[pronoun];
        }
                const prepositionsTable = document.getElementById('prepositionsTable');
        prepositionsTable.innerHTML = ''; 
        for (const preposition in results.prepositions) {
            const row = prepositionsTable.insertRow();
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);
            cell1.textContent = preposition;
            cell2.textContent = results.prepositions[preposition];
        }
        
        const articlesTable = document.getElementById('articlesTable');
        articlesTable.innerHTML = ''; 
        for (const article in results.indefiniteArticles) {
            const row = articlesTable.insertRow();
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);
            cell1.textContent = article;
            cell2.textContent = results.indefiniteArticles[article];
        }
        
        document.getElementById('resultsContainer').style.display = 'block';
    }
});
