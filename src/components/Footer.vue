<template>
    <footer>
        <div class="row">
            <p>
                Experiencing difficulties?
                <a href="https://github.com/meta7x/exercise-collector/issues/new" target="_blank">
                    Open an issue
                </a>
            </p>
        </div>
    </footer>
</template>

<style lang="scss" scoped>
.row {
    font-size: 14px;
    display: flex;
    padding: 8px 24px 16px;
    justify-content: space-between;
    & > :not(:last-child) {
        margin-right: 24px;
    }
}
</style>
