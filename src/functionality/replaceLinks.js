export function replaceLinks(text){
    const regex =
        /\b((?:https?\:\/\/|www\.)(?!(?:[\[\]\(\)]|\\[\\\/]))[^\s\[\]\(\)]+)\b/gi;
    text = text.replace(
        regex,
        " <a target='_blank' href='$1'>$1</a> "
    );
    return text;
}