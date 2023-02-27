const { getProjects, getLeadedProjects } = require("../project/services");
const { getTasks, getEntrustedTasks } = require("../task/services");
const { getTeams, getFoundedTeams } = require("../team/services");

module.exports.getHomePage = async function(userSession) {
    let tasks = (await getTasks(userSession))
        .concat(await getEntrustedTasks(userSession))
        .sort((a, b) => a.period.to - b.period.to)
        .slice(0, 5)
    let projects = (await getProjects(userSession))
        .concat(await getLeadedProjects(userSession))
        .slice(0, 5);
    let teams = (await getTeams(userSession))
        .concat(await getFoundedTeams(userSession))
        .slice(0, 5);

    return {
        'tasks': tasks,
        'projects': projects,
        'teams': teams
    };
};