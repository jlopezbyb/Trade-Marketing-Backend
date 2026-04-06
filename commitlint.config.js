/**
 * Conventional Commits format:
 * <type>(<optional-scope>): <subject>
 *
 * Valid examples:
 * feat(assignment): add employee finder endpoint
 * fix(auth): validate Entra profile typing
 * refactor(parameters): remove unused imports
 * chore: apply lint auto-fixes
 * hotfix(server): patch session cookie config
 *
 * Invalid examples:
 * update employee model and database
 * feat add employee finder endpoint
 */
module.exports = {
	extends: ['@commitlint/config-conventional'],
	rules: {
		// Keep Conventional Commits strict enough for clean history,
		// while allowing a couple of practical team-specific types.
		'type-enum': [
			2,
			'always',
			['build', 'chore', 'ci', 'docs', 'feat', 'fix', 'hotfix', 'perf', 'refactor', 'release', 'revert', 'style', 'test']
		],
		'type-empty': [2, 'never'],
		'subject-empty': [2, 'never'],
		'header-max-length': [2, 'always', 120],

		// Spanish/English mixed subjects are common; avoid unnecessary case friction.
		'subject-case': [0]
	},

	// Ignore common auto-generated messages.
	ignores: [message => message.startsWith('Merge '), message => message.startsWith('Revert "')]
};
